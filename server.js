require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === 1. الإعدادات المتقدمة و CORS ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// قراءة الملفات الثابتة والتصاميم من كل المجلدات
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === 2. الاتصال بـ MongoDB ===
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
let leadsCollection, productsCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('crmapp');
        leadsCollection = db.collection('Leads');
        productsCollection = db.collection('Products');
        console.log('✅ متصل بـ MongoDB بنجاح');
    } catch (err) {
        console.error('❌ خطأ الاتصال بالقاعدة:', err);
    }
}
connectDB();

// دوال جلب البيانات بضمان السيرفر والملفات
async function getLeadsData() {
    if (leadsCollection) {
        try {
            const data = await leadsCollection.find({}).sort({ _id: -1 }).toArray();
            if (data && data.length > 0) return data;
        } catch (e) {}
    }
    try { return JSON.parse(fs.readFileSync('leads.json', 'utf8')); } catch (e) { return []; }
}

async function getProductsData() {
    if (productsCollection) {
        try {
            const data = await productsCollection.find({}).toArray();
            if (data && data.length > 0) return data;
        } catch (e) {}
    }
    try { return JSON.parse(fs.readFileSync('products.json', 'utf8')); } catch (e) { return []; }
}

// =========================================================
// === 3. إرجاع عرض الواجهة والتصميم الأصلي 100% ===
// =========================================================
app.get('/', async (req, res) => {
    try {
        const leads = await getLeadsData();
        const products = await getProductsData();

        // إرسال التصميم الأصلي EJS إن وجد
        if (fs.existsSync(path.join(__dirname, 'views', 'index.ejs'))) {
            return res.render('index', { leads, products });
        }
        // إرسال التصميم الأصلي HTML إن وجد في المجلد الرئيسي
        if (fs.existsSync(path.join(__dirname, 'index.html'))) {
            return res.sendFile(path.join(__dirname, 'index.html'));
        }
        // إرسال التصميم الأصلي HTML إن وجد في مجلد public
        if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
            return res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }

        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (err) {
        res.status(500).send("خطأ في تشغيل اللوحة الأصلية");
    }
});

// روابط الجلب المباشرة للواجهة الأصلية
app.get('/api/leads', async (req, res) => { res.json(await getLeadsData()); });
app.get('/api/products', async (req, res) => { res.json(await getProductsData()); });

// =========================================================
// === 4. API المزامنة لمتجر dzShop ===
// =========================================================
app.get('/api/get-store-products', async (req, res) => {
    try {
        const products = await getProductsData();
        res.json(products);
    } catch (e) { res.json([]); }
});

// إضافة منتج جديد
app.post('/api/products', async (req, res) => {
    try {
        const products = await getProductsData();
        const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            name: req.body.name,
            cost: Number(req.body.cost) || 0,
            price: Number(req.body.price) || 0,
            initialStock: Number(req.body.stock) || 0,
            stock: Number(req.body.stock) || 0,
            soldQty: 0,
            category: req.body.category || 'عام',
            image: req.body.image || ''
        };

        if (productsCollection) {
            await productsCollection.insertOne(newProduct);
        }
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// استقبال طلب جديد من المتجر
app.post('/api/leads', async (req, res) => {
    try {
        const leads = await getLeadsData();
        const newId = leads.length > 0 ? Math.max(...leads.map(l => Number(l.id) || 0)) + 1 : 1;
        
        const newLead = {
            ...req.body,
            id: newId,
            status: req.body.status || 'جديد',
            createdAt: new Date().toISOString()
        };

        if (leadsCollection) {
            await leadsCollection.insertOne(newLead);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

// تحديث الطلب + خصم المخزون عند التأكيد
app.post('/api/leads/update/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const leads = await getLeadsData();
        const lead = leads.find(l => Number(l.id) === id);

        if (lead) {
            const oldStatus = lead.status || '';
            const newStatus = req.body.status || lead.status;

            const confirmWords = ['مؤكد', 'confirmed', 'تم التأكيد', 'قيد الشحن'];
            const isNowConfirmed = confirmWords.some(w => newStatus.includes(w));
            const wasNotConfirmed = !confirmWords.some(w => oldStatus.includes(w));

            if (isNowConfirmed && wasNotConfirmed) {
                const products = await getProductsData();
                let cleanName = (lead.productName || lead.product || '').split('(')[0].trim().toLowerCase();

                const product = products.find(p => 
                    (lead.productId && Number(p.id) === Number(lead.productId)) ||
                    (p.name && p.name.toLowerCase().trim().includes(cleanName))
                );

                if (product && productsCollection) {
                    const qty = parseInt(lead.quantity || lead.qty) || 1;
                    await productsCollection.updateOne(
                        { id: product.id },
                        { $inc: { stock: -qty, soldQty: qty } }
                    );
                }
            }

            if (leadsCollection) {
                await leadsCollection.updateOne(
                    { id: id },
                    { $set: { ...req.body, status: newStatus } }
                );
            }
        }
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// تشغيل السيرفر
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على بورت ${PORT}`));
