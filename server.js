require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === الإعدادات (Middleware) ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === الاتصال بقاعدة البيانات MongoDB ===
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
let leadsCollection, productsCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('crmapp'); // اسم قاعدة البيانات
        leadsCollection = db.collection('Leads');
        productsCollection = db.collection('Products');
        console.log('✅ متصل بـ MongoDB بنجاح');
    } catch (err) {
        console.error('❌ فشل الاتصال بالقاعدة:', err);
    }
}
connectDB();

// === الدوال المساعدة ===
function formatPhoneForWA(phone) {
    let clean = (phone || '').toString().replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '213' + clean.substring(1);
    return clean;
}

// ==========================================
// === 1. إدارة المنتجات (Products) - MongoDB ===
// ==========================================

// جلب المنتجات للمتجر
app.get('/api/get-store-products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.json(products);
    } catch (e) {
        res.status(500).json([]);
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
        res.json({ success: true, product: newProduct });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// حذف منتج
app.post('/api/products/delete/:id', async (req, res) => {
    try {
        await productsCollection.deleteOne({ id: parseInt(req.params.id) });
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// ==========================================
// === 2. إدارة الطلبات (Leads) - MongoDB ===
// ==========================================

// استقبال طلب جديد من المتجر
app.post('/api/leads', async (req, res) => {
    try {
        const leads = await leadsCollection.find({}).toArray();
        const newId = leads.length > 0 ? Math.max(...leads.map(l => Number(l.id) || 0)) + 1 : 1;
        const newLead = {
            ...req.body,
            id: newId,
            status: 'جديد',
            createdAt: new Date()
        };
        await leadsCollection.insertOne(newLead);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

// تحديث حالة الطلب وخصم المخزون عند "التأكيد"
app.post('/api/leads/update/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const lead = await leadsCollection.findOne({ id: id });
        if (!lead) return res.redirect('/');

        const oldStatus = lead.status;
        const newStatus = req.body.status;

        // منطق الخصم عند التأكيد
        const confirmed = ['مؤكد', 'confirmed', 'تم التأكيد'];
        if (confirmed.includes(newStatus) && !confirmed.includes(oldStatus)) {
            const product = await productsCollection.findOne({
                name: { $regex: new RegExp(lead.productName.split('(')[0].trim(), 'i') }
            });
            if (product) {
                const qty = parseInt(lead.quantity) || 1;
                await productsCollection.updateOne(
                    { id: product.id },
                    { $inc: { stock: -qty, soldQty: qty } }
                );
            }
        }

        await leadsCollection.updateOne({ id: id }, { $set: { ...req.body, status: newStatus } });
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
