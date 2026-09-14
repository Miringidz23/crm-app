require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// === الإعدادات الأساسية ===
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
// === 1. لوحة التحكم الشاملة (CRM Dashboard) ===
// ==========================================
app.get('/', async (req, res) => {
    try {
        const leads = leadsCollection ? await leadsCollection.find({}).sort({ _id: -1 }).toArray() : [];
        const products = productsCollection ? await productsCollection.find({}).toArray() : [];

        // حساب الإحصائيات
        const totalSales = leads.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
        const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
        const totalLeads = leads.length;

        // صفوف المنتجات
        const productRows = products.map(p => `
            <tr>
                <td><b>#${p.id}</b></td>
                <td>${p.name}</td>
                <td>${(Number(p.cost)||0).toLocaleString()} د.ج</td>
                <td><b>${(Number(p.price)||0).toLocaleString()} د.ج</b></td>
                <td><span class="badge stock">${p.stock} قطعة</span></td>
                <td><span class="badge sold">${p.soldQty || 0} قطعة</span></td>
                <td>
                    <form action="/api/products/delete/${p.id}" method="POST" style="display:inline;" onsubmit="return confirm('حذف المنتج؟')">
                        <button class="btn-del">🗑️ حذف</button>
                    </form>
                </td>
            </tr>
        `).join('');

        // صفوف الطلبات
        const leadRows = leads.map(l => {
            const phoneClean = (l.phone || '').replace(/\D/g, '');
            const waPhone = phoneClean.startsWith('0') ? '213' + phoneClean.substring(1) : phoneClean;
            return `
            <tr>
                <td><b>#${l.id || '---'}</b></td>
                <td><b>${l.name || 'زبون'}</b></td>
                <td>
                    <a href="https://wa.me/${waPhone}" target="_blank" class="wa-btn">💬 ${l.phone || 'واتساب'}</a>
                </td>
                <td>${l.wilaya || 'غير محددة'}</td>
                <td><b>${l.productName || l.product || 'منتج'}</b></td>
                <td><b>${(Number(l.amount)||0).toLocaleString()} د.ج</b></td>
                <td>
                    <form action="/api/leads/update/${l.id}" method="POST" style="display:flex; gap:5px;">
                        <select name="status" class="status-select">
                            <option value="جديد" ${l.status === 'جديد' ? 'selected' : ''}>جديد</option>
                            <option value="مؤكد" ${l.status === 'مؤكد' || l.status === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                            <option value="قيد الشحن" ${l.status === 'قيد الشحن' ? 'selected' : ''}>قيد الشحن</option>
                            <option value="تم التسليم" ${l.status === 'تم التسليم' ? 'selected' : ''}>تم التسليم</option>
                            <option value="ملغى" ${l.status === 'ملغى' ? 'selected' : ''}>ملغى</option>
                        </select>
                        <button type="submit" class="btn-save">حفظ</button>
                    </form>
                </td>
            </tr>
            `;
        }).join('');

        const html = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>لوحة تحكم Chams CRM</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
                body { background-color: #f4f6f9; margin: 0; padding: 15px; color: #2d3748; }
                .container { max-width: 1200px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 25px; }
                .header h1 { font-size: 26px; color: #1a202c; margin: 0; }
                
                /* بطاقات الإحصائيات */
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 25px; }
                .stat-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
                .stat-card h3 { font-size: 14px; color: #718096; margin: 0 0 8px; }
                .stat-card .val { font-size: 22px; font-weight: 800; color: #2b6cb0; }
                
                /* الأقسام والجداول */
                .section { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 25px; overflow-x: auto; }
                .section h2 { font-size: 18px; margin-top: 0; margin-bottom: 15px; color: #2d3748; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; }
                
                table { width: 100%; border-collapse: collapse; text-align: right; min-width: 600px; }
                th, td { padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-size: 14px; }
                th { background: #f8fafc; color: #4a5568; font-weight: 700; }
                
                .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                .stock { background: #e6fffa; color: #234e52; }
                .sold { background: #ebf8ff; color: #2b6cb0; }
                .wa-btn { background: #25d366; color: #fff; text-decoration: none; padding: 5px 10px; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block; }
                .btn-del { background: #fed7d7; color: #9b2c2c; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; }
                .btn-save { background: #4299e1; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; }
                .status-select { padding: 6px; border-radius: 8px; border: 1px solid #cbd5e0; font-size: 13px; }
                
                /* النماذج */
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 15px; }
                .inp { padding: 10px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 14px; width: 100%; }
                .btn-add { background: #6b46c1; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer; width: 100%; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 منصة المبيعات وتتبع المخزون (Chams CRM)</h1>
                </div>

                <!-- الإحصائيات -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>إجمالي الطلبات 📦</h3>
                        <div class="val">${totalLeads} طلب</div>
                    </div>
                    <div class="stat-card">
                        <h3>إجمالي المبيعات 💰</h3>
                        <div class="val">${totalSales.toLocaleString()} د.ج</div>
                    </div>
                    <div class="stat-card">
                        <h3>المخزون الكلي المتبقي 🧱</h3>
                        <div class="val">${totalStock} قطعة</div>
                    </div>
                </div>

                <!-- إضافة منتج -->
                <div class="section">
                    <h2>📦 إضافة منتج جديد للمخزون والمتجر</h2>
                    <form action="/api/products" method="POST">
                        <div class="form-grid">
                            <input type="text" name="name" placeholder="اسم المنتج" class="inp" required>
                            <input type="number" name="price" placeholder="سعر البيع (د.ج)" class="inp" required>
                            <input type="number" name="cost" placeholder="التكلفة (د.ج)" class="inp">
                            <input type="number" name="stock" placeholder="الكمية في المخزون" class="inp" required>
                            <input type="text" name="image" placeholder="رابط الصورة (URL)" class="inp">
                            <select name="category" class="inp">
                                <option value="fashion">أزياء</option>
                                <option value="electronics">إلكترونيات</option>
                                <option value="digital">منتجات رقمية</option>
                                <option value="home">المنزل</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-add">➕ إضافة المنتج فوراً للمتجر والمخزون</button>
                    </form>
                </div>

                <!-- إدارة المخزون -->
                <div class="section">
                    <h2>🧱 إدارة المنتجات وتتبع المخزون الحالي</h2>
                    <table>
                        <thead>
                            <tr><th>المعرف</th><th>المنتج</th><th>التكلفة</th><th>سعر البيع</th><th>المخزون المتبقي</th><th>الكمية المباعة</th><th>الإجراء</th></tr>
                        </thead>
                        <tbody>
                            ${productRows || '<tr><td colspan="7" style="text-align:center;">لا توجد منتجات مخزنة حالياً</td></tr>'}
                        </tbody>
                    </table>
                </div>

                <!-- قائمة الطلبات -->
                <div class="section">
                    <h2>📋 قائمة الطلبات وتتبع التوصيل</h2>
                    <table>
                        <thead>
                            <tr><th>المعرف</th><th>الزبون</th><th>الهاتف</th><th>الولاية</th><th>المنتج المطلوب</th><th>المبلغ</th><th>الحالة والتأكيد</th></tr>
                        </thead>
                        <tbody>
                            ${leadRows || '<tr><td colspan="7" style="text-align:center;">لا توجد طلبات مسجلة حالياً</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </body>
        </html>
        `;
        res.send(html);
    } catch (err) {
        res.status(500).send("خطأ في تشغيل لوحة التحكم: " + err.message);
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
        res.json([]);
    }
});

// إضافة منتج جديد من النماذج
app.post('/api/products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            name: req.body.name,
            price: Number(req.body.price) || 0,
            cost: Number(req.body.cost) || 0,
            stock: Number(req.body.stock) || 0,
            initialStock: Number(req.body.stock) || 0,
            soldQty: 0,
            category: req.body.category || 'fashion',
            image: req.body.image || ''
        };

        if (productsCollection) {
            await productsCollection.insertOne(newProduct);
        }
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// حذف منتج
app.post('/api/products/delete/:id', async (req, res) => {
    try {
        if (productsCollection) {
            await productsCollection.deleteOne({ id: Number(req.params.id) });
        }
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
        
        const newLead = {
            ...req.body,
            id: newId,
            status: 'جديد',
            createdAt: new Date().toISOString()
        };

        if (leadsCollection) {
            await leadsCollection.insertOne(newLead);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false }); }
});

// تحديث الطلب + خصم المخزون تلقائياً عند التأكيد
app.post('/api/leads/update/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const lead = await leadsCollection.findOne({ id: id });

        if (lead) {
            const oldStatus = lead.status || '';
            const newStatus = req.body.status || lead.status;

            const confirmedWords = ['مؤكد', 'confirmed', 'تم التأكيد'];
            const isConfirming = confirmedWords.some(w => newStatus.includes(w));
            const wasNotConfirmed = !confirmedWords.some(w => oldStatus.includes(w));

            // خصم المخزون فقط عند التأكيد
            if (isConfirming && wasNotConfirmed) {
                let cleanName = (lead.productName || lead.product || '').split('(')[0].trim().toLowerCase();
                
                const product = await productsCollection.findOne({
                    $or: [
                        { id: Number(lead.productId) },
                        { name: { $regex: cleanName, $options: 'i' } }
                    ]
                });

                if (product && productsCollection) {
                    const qty = Number(lead.quantity) || 1;
                    await productsCollection.updateOne(
                        { id: product.id },
                        { $inc: { stock: -qty, soldQty: qty } }
                    );
                }
            }

            await leadsCollection.updateOne(
                { id: id },
                { $set: { status: newStatus } }
            );
        }
        res.redirect('/');
    } catch (e) { res.redirect('/'); }
});

// تشغيل السيرفر
app.listen(PORT, () => console.log(`🚀 السيرفر يعمل بنجاح على البورت ${PORT}`));
