require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === 1. الإعدادات الأساسية ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // السماح بقراءة الملفات من المجلد الرئيسي

// === 2. الاتصال بـ MongoDB ===
const client = new MongoClient(process.env.MONGO_URI);
let leadsCollection, productsCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('crmapp');
        leadsCollection = db.collection('Leads');
        productsCollection = db.collection('Products');
        console.log('✅ متصل بـ MongoDB');
    } catch (err) {
        console.error('❌ خطأ في قاعدة البيانات:', err);
    }
}
connectDB();

// === 3. تشغيل لوحة التحكم (الواجهة) ===
app.get('/', (req, res) => {
    // محاولة إرسال ملف index.html من المجلد الرئيسي
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            // إذا لم يجد الملف، يرسل رسالة بسيطة لكي لا يظهر خطأ 404
            res.status(200).send("<h1>سيرفر الـ CRM يعمل بنجاح!</h1><p>تأكد من وجود ملف index.html في المجلد الرئيسي على GitHub.</p>");
        }
    });
});

// === 4. API المنتجات لمتجر dzShop ===
app.get('/api/get-store-products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.json(products || []);
    } catch (e) {
        res.json([]);
    }
});

// === 5. إضافة منتج جديد ===
app.post('/api/products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
        const newProduct = {
            ...req.body,
            id: newId,
            stock: Number(req.body.stock) || 0,
            price: Number(req.body.price) || 0,
            soldQty: 0
        };
        await productsCollection.insertOne(newProduct);
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// === 6. استقبال الطلبات وخصم المخزون ===
app.post('/api/leads', async (req, res) => {
    try {
        const leads = await leadsCollection.find({}).toArray();
        const newId = leads.length > 0 ? Math.max(...leads.map(l => Number(l.id) || 0)) + 1 : 1;
        const newLead = { ...req.body, id: newId, status: 'جديد', createdAt: new Date() };
        await leadsCollection.insertOne(newLead);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/api/leads/update/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const lead = await leadsCollection.findOne({ id: id });
        if (lead) {
            const confirmedStatuses = ['مؤكد', 'confirmed', 'تم التأكيد'];
            if (confirmedStatuses.includes(req.body.status) && !confirmedStatuses.includes(lead.status)) {
                let cleanName = (lead.productName || lead.product || '').split('(')[0].trim();
                await productsCollection.updateOne(
                    { name: { $regex: cleanName, $options: 'i' } },
                    { $inc: { stock: -1, soldQty: 1 } }
                );
            }
            await leadsCollection.updateOne({ id: id }, { $set: { ...req.body } });
        }
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// === تشغيل السيرفر ===
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على بورت ${PORT}`));
