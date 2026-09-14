require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === إعداد المحرك والإعدادات الأساسية ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname));

// إعداد محرك العرض للوحة التحكم
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === الاتصال بقاعدة البيانات MongoDB ===
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

// ==========================================
// === 1. الصفحة الرئيسية للوحة التحكم CRM ===
// ==========================================
app.get('/', async (req, res) => {
  try {
    const leads = leadsCollection ? await leadsCollection.find({}).sort({ _id: -1 }).toArray() : [];
    const products = productsCollection ? await productsCollection.find({}).toArray() : [];
    
    // عرض صفحة لوحة التحكم
    if (res.render) {
      res.render('index', { leads, products });
    } else {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  } catch (err) {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// ==========================================
// === 2. API المنتجات لمتجر dzShop ===
// ==========================================
app.get('/api/get-store-products', async (req, res) => {
  try {
    const products = productsCollection ? await productsCollection.find({}).toArray() : [];
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
      id: newId,
      name: req.body.name,
      price: Number(req.body.price) || 0,
      oldPrice: Number(req.body.oldPrice) || 0,
      cost: Number(req.body.cost) || 0,
      category: req.body.category || 'عام',
      image: req.body.image || '',
      stock: Number(req.body.stock) || 0,
      soldQty: 0,
      initialStock: Number(req.body.stock) || 0
    };

    await productsCollection.insertOne(newProduct);
    res.redirect('/');
  } catch (e) {
    res.redirect('/');
  }
});

// ==========================================
// === 3. استقبال الطلبات وتأكيدها ===
// ==========================================

// استقبال طلب من المتجر
app.post('/api/leads', async (req, res) => {
  try {
    const leads = await leadsCollection.find({}).toArray();
    const newId = leads.length > 0 ? Math.max(...leads.map(l => Number(l.id) || 0)) + 1 : 1;
    
    const newLead = {
      ...req.body,
      id: newId,
      status: 'جديد',
      createdAt: new Date().toISOString()
    };
    
    await leadsCollection.insertOne(newLead);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// تحديث الطلب + خصم المخزون فقط عند التأكيد
app.post('/api/leads/update/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const lead = await leadsCollection.findOne({ id: id });

    if (lead) {
      const oldStatus = lead.status || '';
      const newStatus = req.body.status || lead.status;

      const confirmedWords = ['مؤكد', 'confirmed', 'تم التأكيد', 'قيد الشحن'];
      const isConfirming = confirmedWords.some(w => newStatus.includes(w));
      const wasNotConfirmed = !confirmedWords.some(w => oldStatus.includes(w));

      if (isConfirming && wasNotConfirmed) {
        let cleanName = (lead.productName || lead.product || '').split('(')[0].trim().toLowerCase();
        
        const product = await productsCollection.findOne({
          $or: [
            { id: Number(lead.productId) },
            { name: { $regex: cleanName, $options: 'i' } }
          ]
        });

        if (product) {
          const qty = parseInt(lead.quantity) || 1;
          await productsCollection.updateOne(
            { id: product.id },
            { $inc: { stock: -qty, soldQty: qty } }
          );
        }
      }

      await leadsCollection.updateOne(
        { id: id },
        { $set: { ...req.body, status: newStatus } }
      );
    }
    res.redirect('/');
  } catch (e) {
    res.redirect('/');
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
