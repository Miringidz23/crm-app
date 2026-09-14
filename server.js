require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === الإعدادات والمجلدات ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// قراءة الملفات العامة من كل المجلدات المحتملة
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === الاتصال بقاعدة البيانات MongoDB ===
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
        console.error('❌ خطأ قاعدة البيانات:', err);
    }
}
connectDB();

// ==========================================
// === 1. عرض لوحة تحكم الـ CRM تلقائياً ===
// ==========================================
app.get('/', async (req, res) => {
    try {
        const leads = leadsCollection ? await leadsCollection.find({}).sort({ _id: -1 }).toArray() : [];
        const products = productsCollection ? await productsCollection.find({}).toArray() : [];

        // إذا كانت الواجهة تعتمد على EJS
        if (fs.existsSync(path.join(__dirname, 'views', 'index.ejs'))) {
            return res.render('index', { leads, products });
        }
        // إذا كانت الواجهة داخل مجلد public
        if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
            return res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
        // إذا كانت الواجهة في المجلد الرئيسي
        if (fs.existsSync(path.join(__dirname, 'index.html'))) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }

        res.send("لم نتمكن من العثور على ملف الواجهة index.html أو index.ejs");
    } catch (err) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// ==========================================
// === 2. API المنتجات لمتجر dzShop ===
// ==========================================
app.get('/api/get-store-products', async (req, res) => {
    try {
        const products = productsCollection ? await productsCollection.find({}).toArray() : [];
        res.json(products || []);
    } catch (e) {
        res.json([]);
    }
});

// إضافة منتج جديد
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

// ==========================================
// === 3. استقبال الطلبات وخصم المخزون ===
// ==========================================
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

// تشغيل السيرفر
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على بورت ${PORT}`));
