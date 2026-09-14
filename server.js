require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === 1. الإعدادات الأساسية و CORS للمتجر ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 2. الاتصال بقاعدة البيانات MongoDB (للحفظ الدائم) ===
const MONGO_URI = process.env.MONGO_URI;
let leadsCollection, productsCollection;

if (MONGO_URI) {
    const client = new MongoClient(MONGO_URI);
    client.connect().then(() => {
        const db = client.db('crmapp');
        leadsCollection = db.collection('Leads');
        productsCollection = db.collection('Products');
        console.log('✅ متصل بـ MongoDB بنجاح');
    }).catch(err => console.error('❌ خطأ في MongoDB:', err));
}

// =========================================================
// === 3. Facebook Webhook (من كودك الخاص) ===
// =========================================================
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = "MY_CRM_TOKEN_123";
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(400);
});

app.post('/webhook', (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(async entry => {
            const webhookEvent = entry.messaging ? entry.messaging[0] : null;
            if (webhookEvent && webhookEvent.message) {
                const senderId = webhookEvent.sender.id;
                const messageText = webhookEvent.message.text || '(بدون نص)';

                const newLead = {
                    senderId: senderId,
                    message: messageText,
                    date: new Date().toISOString()
                };

                if (leadsCollection) {
                    await leadsCollection.insertOne(newLead);
                }
                console.log('طلب جديد من الفايسبوك:', newLead);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// =========================================================
// === 4. لوحة التحكم Chams CRM (تفتح على / وعلى /dashboard) ===
// =========================================================
const renderDashboard = async (req, res) => {
    let leads = [];
    try {
        if (leadsCollection) {
            leads = await leadsCollection.find({}).sort({ _id: -1 }).toArray();
        }
    } catch (e) { leads = []; }

    let rows = leads.map(lead => `
        <tr>
            <td>${lead.senderId || lead.id || lead.phone || 'زبون'}</td>
            <td>${lead.message || lead.productName || lead.name || 'طلب جديد'}</td>
            <td>${new Date(lead.date || lead.createdAt || Date.now()).toLocaleString('ar-TN')}</td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="15">
        <title>Chams CRM - الطلبات</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f9; margin: 0; padding: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 15px; }
            th, td { padding: 12px; text-align: right; border-bottom: 1px solid #eee; }
            th { background: #4a90d9; color: white; }
            tr:hover { background: #f1f8ff; }
            .count { text-align: center; color: #666; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>📋 لوحة طلبات Chams CRM Pro</h1>
        <p class="count">عدد الطلبات: ${leads.length} (تحديث تلقائي كل 15 ثانية)</p>
        <table>
            <tr><th>رقم الزبون / الهوية</th><th>الرسالة / المنتج</th><th>التاريخ</th></tr>
            ${rows || '<tr><td colspan="3" style="text-align:center; padding:20px;">لا توجد طلبات حتى الآن</td></tr>'}
        </table>
    </body>
    </html>
    `;
    res.send(html);
};

// جعل اللوحة تفتح في الرابطين المباشر و /dashboard
app.get('/', renderDashboard);
app.get('/dashboard', renderDashboard);

// =========================================================
// === 5. API الربط مع متجر dzShop ===
// =========================================================

// جلب المنتجات للمتجر
app.get('/api/get-store-products', async (req, res) => {
    try {
        if (productsCollection) {
            const products = await productsCollection.find({}).toArray();
            return res.json(products);
        }
        res.json([]);
    } catch (e) { res.json([]); }
});

// إضافة منتج جديد
app.post('/api/products', async (req, res) => {
    try {
        if (productsCollection) {
            const products = await productsCollection.find({}).toArray();
            const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
            const newProduct = { ...req.body, id: newId, stock: Number(req.body.stock) || 0, price: Number(req.body.price) || 0 };
            await productsCollection.insertOne(newProduct);
        }
        res.redirect('/dashboard');
    } catch (e) { res.redirect('/dashboard'); }
});

// استقبال طلب من المتجر
app.post('/api/leads', async (req, res) => {
    try {
        if (leadsCollection) {
            const newLead = { ...req.body, date: new Date().toISOString() };
            await leadsCollection.insertOne(newLead);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

// تحديث الطلب وخصم المخزون عند التأكيد
app.post('/api/leads/update/:id', async (req, res) => {
    try {
        if (leadsCollection && productsCollection) {
            const id = parseInt(req.params.id);
            const lead = await leadsCollection.findOne({ id: id });
            if (lead) {
                const confirmed = ['مؤكد', 'confirmed', 'تم التأكيد'];
                if (confirmed.includes(req.body.status)) {
                    let cleanName = (lead.productName || lead.message || '').split('(')[0].trim();
                    await productsCollection.updateOne(
                        { name: { $regex: cleanName, $options: 'i' } },
                        { $inc: { stock: -1 } }
                    );
                }
                await leadsCollection.updateOne({ id: id }, { $set: req.body });
            }
        }
        res.redirect('/dashboard');
    } catch (e) { res.redirect('/dashboard'); }
});

// === تشغيل السيرفر ===
app.listen(PORT, () => {
    console.log(`Chams CRM Pro Ultimate Edition running on port ${PORT}`);
});
