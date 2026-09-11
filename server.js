require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { MongoClient } = require('mongodb');
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
let leadsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('crmapp');
  leadsCollection = db.collection('leads');
  console.log('✅ متصل بقاعدة بيانات MongoDB');
}


async function sendMessengerReply(senderId, text) {
  try {
    const url = 'https://graph.facebook.com/v20.0/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: text }
      })
    });
  } catch (e) {
    console.error('فشل إرسال الرد:', e.message);
  }
}

function generateSmartReply(messageText) {
  const msg = messageText.toLowerCase();
  if (msg.includes('سلام') || msg.includes('صباح') || msg.includes('مرحبا') || msg.includes('اهلا')) {
    return 'أهلاً وسهلاً بيك 👋 شكراً لتواصلك معنا. كيفاش نقدر نعاونك اليوم؟';
  }
  if (msg.includes('سعر') || msg.includes('ثمن') || msg.includes('بشحال')) {
    return 'شكراً على اهتمامك! راح نتصلو بيك قريباً باش نعطيوك كل التفاصيل على السعر والمنتج 💰';
  }
  if (msg.includes('طلب') || msg.includes('نحب نشري') || msg.includes('نبغي')) {
    return 'تم استلام طلبك بنجاح ✅ فريقنا راح يتواصل معاك في أقرب وقت لتأكيد الطلب.';
  }
  return 'شكراً لرسالتك 🙏 توصلنا بيها وراح نرد عليك في أقرب وقت ممكن.';
}


async function sendMessengerReply(senderId, text) {
  try {
    const url = 'https://graph.facebook.com/v20.0/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: text }
      })
    });
  } catch (e) {
    console.error('فشل إرسال الرد:', e.message);
  }
}

function generateSmartReply(messageText) {
  const msg = messageText.toLowerCase();
  if (msg.includes('سلام') || msg.includes('صباح') || msg.includes('مرحبا') || msg.includes('اهلا')) {
    return 'أهلاً وسهلاً بيك 👋 شكراً لتواصلك معنا. كيفاش نقدر نعاونك اليوم؟';
  }
  if (msg.includes('سعر') || msg.includes('ثمن') || msg.includes('بشحال')) {
    return 'شكراً على اهتمامك! راح نتصلو بيك قريباً باش نعطيوك كل التفاصيل على السعر والمنتج 💰';
  }
  if (msg.includes('طلب') || msg.includes('نحب نشري') || msg.includes('نبغي')) {
    return 'تم استلام طلبك بنجاح ✅ فريقنا راح يتواصل معاك في أقرب وقت لتأكيد الطلب.';
  }
  return 'شكراً لرسالتك 🙏 توصلنا بيها وراح نرد عليك في أقرب وقت ممكن.';
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = path.join(__dirname, 'leads.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

const WILAYAS = [
  "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة",
  "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
  "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو",
  "16 - الجزائر", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
  "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة",
  "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
  "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس",
  "36 - الطارف", "37 - تندوف", "38 - تسمسيلت", "39 - الوادي", "40 - خنشلة",
  "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة",
  "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - المغير", "50 - المنيعة",
  "51 - أولاد جلال", "52 - برج باجي مختار", "53 - بني عباس", "54 - تيميمون",
  "55 - توقرت", "56 - جانت", "57 - إن صالح", "58 - إن قزام"
];

const COURIERS = ["Yalidine Express", "ZR Express", "Kazi Tour", "Maystro Delivery", "Nord & Sud", "أخرى / توصيل خاص"];

function readData(file, defaultData = []) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return defaultData;
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function readLeads() {
  return await leadsCollection.find({}).toArray();
}
async function saveLeads(leads) {
  await leadsCollection.deleteMany({});
  if (leads.length > 0) await leadsCollection.insertMany(leads);
}

function readProducts() {
  const products = readData(PRODUCTS_FILE, [
    { id: 1, name: "قميص رياضي POD", cost: 1200, price: 3500, initialStock: 60, stock: 4, soldQty: 56 },
    { id: 2, name: "حقيبة ظهر رقمية", cost: 2000, price: 5500, initialStock: 30, stock: 20, soldQty: 10 }
  ]);
  
  // تحديث البيانات القديمة إن وجد منتج بدون initialStock
  return products.map(p => ({
    ...p,
    initialStock: p.initialStock !== undefined ? p.initialStock : (p.stock || 0),
    soldQty: p.soldQty !== undefined ? p.soldQty : 0
  }));
}
function saveProducts(products) { saveData(PRODUCTS_FILE, products); }

function formatPhoneForWA(phone) {
  let clean = (phone || '').toString().replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '213' + clean.substring(1);
  }
  return clean;
}

// === إضافة منتج ===
app.post('/api/products', (req, res) => {
  const products = readProducts();
  const { name, cost, price, stock } = req.body;
  const initialQty = parseInt(stock) || 0;
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    cost: parseFloat(cost) || 0,
    price: parseFloat(price) || 0,
    initialStock: initialQty,
    stock: initialQty,
    soldQty: 0
  };
  products.unshift(newProduct);
  saveProducts(products);
  res.redirect('/');
});

// === إعادة تزويد المخزون (تزويد شحنة جديدة) ===
app.post('/api/products/restock/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const addStock = parseInt(req.body.addStock) || 0;
  const product = products.find(p => p.id === id);
  if (product && addStock > 0) {
    product.initialStock = (product.initialStock || 0) + addStock;
    product.stock = (product.stock || 0) + addStock;
    saveProducts(products);
  }
  res.redirect('/');
});

// === حذف منتج ===
app.post('/api/products/delete/:id', (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.id !== parseInt(req.params.id));
  saveProducts(products);
  res.redirect('/');
});

// === إضافة زبون وطلب ===
app.post('/api/leads', async (req, res) => {
  const leads = await readLeads();
  const products = readProducts();
  const { name, email, phone, wilaya, productId, product_name, price, qty, quantity: qtyBody, notes, status, courier, tracking, customAmount } = req.body;

  const product = products.find(p => p.id === parseInt(productId));
  const quantity = parseInt(qty) || parseInt(qtyBody) || 1;

  let amount = 0;
  let cost = 0;
  let productName = req.body.product_name || req.body.productName || req.body.product || "طلب عام";

  if (product) {
    productName = product.name;
    amount = product.price * quantity;
    cost = product.cost * quantity;
    
    // خصم المتبقي وزيادة المباع
    product.stock = Math.max(0, product.stock - quantity);
    product.soldQty = (product.soldQty || 0) + quantity;
    saveProducts(products);
  } else {
  amount = parseFloat(customAmount) || parseFloat(price) || parseFloat(req.body.total) || parseFloat(req.body.amount) || 0;
    
  }

  const newLead = {
    id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
    name,
    email,
    phone,
    wilaya: wilaya || 'غير محددة',
    productName,
    quantity,
    amount,
    cost,
    profit: amount - cost,
    courier: courier || 'Yalidine Express',
    tracking: tracking || '',
    notes: notes || 'لا توجد ملاحظات',
    status: status || 'جديد',
    createdAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  await saveLeads(leads);
  res.redirect('/?newLead=true');
});

// === تعديل زبون ===
app.post('/api/leads/update/:id', async (req, res) => {
  const leads = await readLeads();
  const id = parseInt(req.params.id);
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.name = req.body.name || lead.name;
    lead.email = req.body.email || lead.email;
    lead.phone = req.body.phone || lead.phone;
    lead.wilaya = req.body.wilaya || lead.wilaya;
    lead.amount = parseFloat(req.body.amount) || lead.amount;
    lead.profit = lead.amount - (lead.cost || 0);
    lead.courier = req.body.courier || lead.courier;
    lead.tracking = req.body.tracking || lead.tracking;
    lead.notes = req.body.notes || '';
    lead.status = req.body.status || lead.status;
    await saveLeads(leads);
  }
  res.redirect('/');
});

// === حذف زبون ===
app.post('/api/leads/delete/:id', async (req, res) => {
  let leads = await readLeads();
  leads = leads.filter(l => l.id !== parseInt(req.params.id));
  await saveLeads(leads);
  res.redirect('/');
});

// === تصدير CSV ===
app.get('/api/export', async (req, res) => {
  const leads = await readLeads();
  let csvContent = 'المعرف,الاسم,الهاتف,الولاية,المنتج,المبلغ,الربح الصافي,شركة التوصيل,رقم التتبع,الحالة,التاريخ\n';
  
  leads.forEach(l => {
    csvContent += `${l.id},"${l.name}","${l.phone}","${l.wilaya}","${l.productName || '-'}",${l.amount || 0},${l.profit || 0},"${l.courier || '-'}","${l.tracking || '-'}","${l.status}","${l.createdAt || '-'}"\n`;
  });

  const bom = '\uFEFF';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=leads_export_${Date.now()}.csv`);
  res.status(200).send(bom + csvContent);
});

// === وصل الشحن ===
app.get('/invoice/:id', async (req, res) => {
  const leads = await readLeads();
  const lead = leads.find(l => l.id === parseInt(req.params.id));
  if (!lead) return res.status(404).send("الزبون غير موجود");

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>وصل شحن #${lead.id} - ${lead.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; font-family: 'Tajawal', sans-serif; margin: 0; padding: 0; }
        body { padding: 30px; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .invoice-card { background: white; border: 2px dashed #333; padding: 30px; width: 100%; max-width: 500px; border-radius: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 15px; margin-bottom: 20px; }
        .info-group { margin-bottom: 12px; display: flex; justify-content: space-between; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        .amount-box { background: #f0f3ff; border: 1px solid #4318ff; padding: 15px; border-radius: 10px; text-align: center; margin-top: 20px; }
        .btn-print { background: #4318ff; color: white; border: none; padding: 12px 20px; font-weight: bold; border-radius: 8px; width: 100%; font-size: 16px; cursor: pointer; margin-top: 20px; }
        @media print { body { background: white; padding: 0; } .btn-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <h2>📦 وصل شحن وطلب (Delivery Slip)</h2>
          <p>رقم الطلب: #${lead.id} | شركة الشحن: ${lead.courier || 'عام'}</p>
        </div>
        <div class="info-group"><span>اسم الزبون:</span><strong>${lead.name}</strong></div>
        <div class="info-group"><span>رقم الهاتف:</span><strong>${lead.phone}</strong></div>
        <div class="info-group"><span>الولاية:</span><strong>${lead.wilaya}</strong></div>
        <div class="info-group"><span>المنتج المطلوب:</span><strong>${lead.productName || 'طلب عام'} (x${lead.quantity || 1})</strong></div>
        <div class="info-group"><span>رقم التتبع (Tracking):</span><strong>${lead.tracking || 'غير محدد'}</strong></div>
        <div class="info-group"><span>ملاحظات:</span><strong>${lead.notes || 'لا توجد'}</strong></div>
        <div class="amount-box">
          <span>المبلغ المطلوب تحصيله عند الاستلام (COD)</span>
          <h3 style="font-size:24px; color:#2e7d32; margin-top:5px;">${(lead.amount || 0).toLocaleString()} د.ج</h3>
        </div>
        <button onclick="window.print()" class="btn-print">🖨️ طباعة الوصل (PDF)</button>
      </div>
    </body>
    </html>
  `);
});

// === الصفحة الرئيسية ===
app.get('/', async (req, res) => {
  const leads = await readLeads();
  const products = readProducts();

  const total = leads.length;
  const newLeads = leads.filter(l => l.status === 'جديد').length;
  const totalRevenue = leads.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
  const totalNetProfit = leads.filter(l => l.status === 'تم التسليم').reduce((sum, l) => sum + (parseFloat(l.profit) || 0), 0);

  const lowStockProducts = products.filter(p => p.stock < 5);
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);

  let alertBannerHtml = '';
  if (lowStockProducts.length > 0) {
    const lowStockNames = lowStockProducts.map(p => `<strong>${p.name}</strong> (${p.stock} متبقي)`).join(' ، ');
    alertBannerHtml = `
      <div class="alert-box danger-alert">
        ⚠️ <strong>تنبيه للمخزون:</strong> المنتجات التالية أوشكت على النفاد: ${lowStockNames}.
      </div>
    `;
  }

  const statusCounts = {
    'جديد': leads.filter(l => l.status === 'جديد').length,
    'قيد التأكيد': leads.filter(l => l.status === 'قيد التأكيد').length,
    'تم الشحن': leads.filter(l => l.status === 'تم الشحن').length,
    'تم التسليم': leads.filter(l => l.status === 'تم التسليم').length,
    'ملغى': leads.filter(l => l.status === 'ملغى').length
  };

  const wilayaCounts = {};
  leads.forEach(l => {
    const w = l.wilaya || 'غير محددة';
    wilayaCounts[w] = (wilayaCounts[w] || 0) + 1;
  });

  const wilayaOptions = WILAYAS.map(w => `<option value="${w}">${w}</option>`).join('');
  const courierOptions = COURIERS.map(c => `<option value="${c}">${c}</option>`).join('');
  const productOptions = products.map(p => `<option value="${p.id}">${p.name} - (سعر: ${p.price} د.ج | متبقي: ${p.stock})</option>`).join('');

  let productRows = products.map(p => {
    const isLow = p.stock < 5;
    const stockBadgeClass = isLow ? 'bg-cancel' : 'bg-new';
    const alertTag = isLow ? ' ⚠️ (مخزون منخفض)' : '';

    return `
      <tr>
        <td>#${p.id}</td>
        <td><strong>${p.name}</strong>${alertTag}</td>
        <td>${p.cost.toLocaleString()} د.ج</td>
        <td><strong style="color:#2e7d32;">${p.price.toLocaleString()} د.ج</strong></td>
        <td><span class="badge bg-pending" style="font-size:13px;">${p.initialStock || p.stock} قطعة</span></td>
        <td><span class="badge bg-shipping" style="font-size:13px;">${p.soldQty || 0} قطعة</span></td>
        <td><span class="badge ${stockBadgeClass}" style="font-size:13px;">${p.stock} قطعة</span></td>
        <td>
          <form action="/api/products/delete/${p.id}" method="POST" style="margin:0;" onsubmit="return confirm('حذف هذا المنتج؟')">
            <button type="submit" class="btn-action btn-delete">🗑️ حذف</button>
          </form>
        </td>
      </tr>
    `;
  }).join('');

  let rows = leads.map(l => {
    const waPhone = formatPhoneForWA(l.phone);
    const trackingMsg = l.tracking ? ` رقم التتبع الخاص بك هو: ${l.tracking} عبر ${l.courier}.` : '';
    const waText = encodeURIComponent(`مرحباً ${l.name}، نود تأكيد طلبك رقم #${l.id} (${l.productName || 'طلبك'}).${trackingMsg} هل العنوان في ${l.wilaya} صحيح؟`);
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

    let badgeClass = 'bg-new';
    if(l.status === 'قيد التأكيد') badgeClass = 'bg-pending';
    if(l.status === 'تم الشحن') badgeClass = 'bg-shipping';
    if(l.status === 'تم التسليم') badgeClass = 'bg-done';
    if(l.status === 'ملغى') badgeClass = 'bg-cancel';

    const leadJson = JSON.stringify(l).replace(/'/g, "&apos;");

    return `
      <tr class="lead-row" data-status="${l.status}" data-search="${l.name.toLowerCase()} ${l.phone} ${(l.wilaya || '').toLowerCase()} ${(l.tracking || '').toLowerCase()}">
        <td>#${l.id}</td>
        <td><strong>${l.name}</strong></td>
        <td>
          ${l.phone}
          <a href="${waUrl}" target="_blank" class="btn-wa" title="إرسال تأكيد واتساب">💬 WhatsApp</a>
        </td>
        <td><span class="badge-wilaya">${l.wilaya || 'غير محددة'}</span></td>
        <td>${l.productName || 'طلب عام'} (x${l.quantity || 1})</td>
        <td><strong style="color: #2e7d32;">${(l.amount || 0).toLocaleString()} د.ج</strong></td>
        <td><strong style="color: #4318ff;">+${(l.profit || 0).toLocaleString()} د.ج</strong></td>
        <td>
          <span style="font-size:12px; font-weight:bold; color:#555;">${l.courier || 'Yalidine'}</span>
          <br><small style="color:#888;">${l.tracking ? '📌 ' + l.tracking : 'لا يوجد تتبع'}</small>
        </td>
        <td><span class="badge ${badgeClass}">${l.status}</span></td>
        <td style="display:flex; gap: 6px;">
          <a href="/invoice/${l.id}" target="_blank" class="btn-action btn-print-link">🧾 الوصل</a>
          <button onclick='openEditModal(${leadJson})' class="btn-action btn-edit">✏️ تعديل</button>
          <form action="/api/leads/delete/${l.id}" method="POST" style="margin:0;" onsubmit="return confirm('هل أنت تأكد؟')">
            <button type="submit" class="btn-action btn-delete">🗑️ حذف</button>
          </form>
        </td>
      </tr>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>منصة المبيعات وتتبع المخزون</title>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        * { box-sizing: border-box; font-family: 'Tajawal', sans-serif; margin: 0; padding: 0; }
        body { background-color: #f4f7fe; color: #2b3674; padding: 20px; width: 100%; min-height: 100vh; }
        .container { width: 100%; max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .header h1 { font-size: 24px; font-weight: 700; color: #1b2559; }
        .btn-export { background: #107c41; color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; }
        
        .alert-box { padding: 15px 20px; border-radius: 12px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
        .danger-alert { background-color: #ffe5e5; border: 1px solid #e53935; color: #c62828; }
        .success-toast { display:none; position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#05cd99; color:white; padding:15px 30px; border-radius:30px; font-weight:bold; box-shadow:0 10px 20px rgba(0,0,0,0.15); z-index:9999; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0px 10px 30px rgba(0,0,0,0.05); }
        .stat-card h4 { color: #a3bbd6; font-size: 13px; margin-bottom: 8px; }
        .stat-card p { font-size: 22px; font-weight: bold; color: #1b2559; }

        .charts-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .chart-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0px 10px 30px rgba(0,0,0,0.05); }

        .card { background: #ffffff; border-radius: 16px; padding: 20px; box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12); margin-bottom: 25px; width: 100%; }
        .form-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
        input, select, button { padding: 12px 16px; border-radius: 10px; border: 1px solid #e0e5f2; font-size: 14px; outline: none; width: 100%; }
        .btn-primary { background: #4318ff; color: white; border: none; font-weight: bold; cursor: pointer; }
        .table-responsive { width: 100%; overflow-x: auto; background: #fff; border-radius: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: right; min-width: 1000px; }
        th, td { padding: 14px; border-bottom: 1px solid #e9edf7; white-space: nowrap; }
        th { color: #a3bbd6; font-size: 13px; text-transform: uppercase; background-color: #f8fafc; }
        .badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; }
        .bg-new { background: #e6faf5; color: #05cd99; }
        .bg-pending { background: #fff8e6; color: #ffb800; }
        .bg-shipping { background: #e8f4fd; color: #3182ce; }
        .bg-done { background: #eff4fb; color: #4318ff; }
        .bg-cancel { background: #ffe5e5; color: #e53935; }
        .badge-wilaya { background: #f0f3ff; color: #2b3674; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 500; }
        .btn-wa { background: #25d366; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold; margin-right: 6px; display: inline-block; }
        .btn-action { padding: 6px 12px; border-radius: 8px; font-size: 12px; border: none; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; }
        .btn-print-link { background: #e0e7ff; color: #3730a3; }
        .btn-edit { background: #f4f7fe; color: #4318ff; }
        .btn-delete { background: #ffe5e5; color: #e53935; }
        .modal { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 25px; border-radius: 16px; width: 90%; max-width: 500px; }
      </style>
    </head>
    <body>
      <div id="toast" class="success-toast">🎉 تم تسجيل الطلبية بنجاح!</div>

      <div class="container">
        <div class="header">
          <h1>🚀 منصة المبيعات وتتبع المخزون</h1>
          <a href="/api/export" class="btn-export">📊 تصدير البيانات إلى Excel</a>
        </div>

        ${alertBannerHtml}

        <div class="stats-grid">
          <div class="stat-card"><h4>إجمالي الزبائن</h4><p>${total}</p></div>
          <div class="stat-card"><h4>طلبات جديدة 🆕</h4><p style="color: #05cd99;">${newLeads}</p></div>
          <div class="stat-card"><h4>المخزون المتبقي الكلي 📦</h4><p style="color: ${lowStockProducts.length > 0 ? '#e53935' : '#1b2559'};">${totalStockCount} قطعة</p></div>
          <div class="stat-card"><h4>إجمالي المبيعات 💰</h4><p style="color: #2e7d32;">${totalRevenue.toLocaleString()} د.ج</p></div>
          <div class="stat-card" style="border:2px solid #4318ff;"><h4>الربح الصافي المحصل 💵</h4><p style="color: #4318ff;">+${totalNetProfit.toLocaleString()} د.ج</p></div>
        </div>

        <div class="charts-container">
          <div class="chart-card">
            <h3>📈 توزيع حالات الطلبات</h3>
            <canvas id="statusChart"></canvas>
          </div>
          <div class="chart-card">
            <h3>📍 المبيعات حسب الولايات</h3>
            <canvas id="wilayaChart"></canvas>
          </div>
        </div>

        <!-- إدارة المنتجات والمخزون -->
        <div class="card">
          <h3 style="margin-bottom: 15px;">📦 إدارة المنتجات وتتبع المخزون</h3>
          <form action="/api/products" method="POST" class="form-container" style="margin-bottom:15px;">
            <input type="text" name="name" placeholder="اسم المنتج" required>
            <input type="number" name="cost" placeholder="سعر التكلفة (د.ج)" step="any" required>
            <input type="number" name="price" placeholder="سعر البيع (د.ج)" step="any" required>
            <input type="number" name="stock" placeholder="الكمية المشتراة / الأولية (مثلاً 50)" required>
            <button type="submit" class="btn-primary">➕ إضافة منتج جديد</button>
          </form>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>المنتج</th>
                  <th>التكلفة</th>
                  <th>سعر البيع</th>
                  <th>📥 الكمية الأولية (الداخلة)</th>
                  <th>📤 الكمية المباعة</th>
                  <th>📦 المخزون المتبقي</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>${productRows}</tbody>
            </table>
          </div>
        </div>

        <!-- إضافة طلب جديد -->
        <div class="card">
          <h3 style="margin-bottom: 15px;">➕ تسجيل طلب وصفقة جديدة</h3>
          <form action="/api/leads" method="POST" class="form-container">
            <input type="text" name="name" placeholder="اسم الزبون" required>
            <input type="email" name="email" placeholder="البريد الإلكتروني">
            <input type="tel" name="phone" placeholder="رقم الهاتف" required>
            <select name="wilaya" required>
              <option value="" disabled selected>اختر الولاية...</option>
              ${wilayaOptions}
            </select>
            <select name="productId" required>
              <option value="" disabled selected>اختر المنتج من المخزن...</option>
              ${productOptions}
            </select>
            <input type="number" name="qty" placeholder="الكمية المطلوبة" value="1" min="1" required>
            <select name="courier">
              ${courierOptions}
            </select>
            <input type="text" name="tracking" placeholder="رقم التتبع (Tracking Number)">
            <input type="text" name="notes" placeholder="ملاحظات حول الطلب">
            <select name="status">
              <option value="جديد">جديد</option>
              <option value="قيد التأكيد">قيد التأكيد</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="ملغى">ملغى</option>
            </select>
            <button type="submit" class="btn-primary" style="grid-column: span 2;">تسجيل الصفقة وخصم المخزون تلقائياً</button>
          </form>
        </div>

        <!-- قائمة الصفقات -->
        <div class="card">
          <h3 style="margin-bottom: 15px;">📋 قائمة الطلبات وتتبع التوصيل</h3>
          <div style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" id="searchInput" placeholder="🔍 ابحث بالاسم، الهاتف، الولاية، أو رقم التتبع..." style="flex:2;">
            <select id="statusFilter" style="flex:1;">
              <option value="الكل">كل الحالات</option>
              <option value="جديد">جديد</option>
              <option value="قيد التأكيد">قيد التأكيد</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="ملغى">ملغى</option>
            </select>
          </div>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>المعرف</th>
                  <th>الزبون</th>
                  <th>الهاتف & واتساب</th>
                  <th>الولاية</th>
                  <th>المنتج</th>
                  <th>المبلغ</th>
                  <th>الربح الصافي</th>
                  <th>شركة التوصيل والتتبع</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody id="leadsTable">${rows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal التعديل -->
      <div id="editModal" class="modal">
        <div class="modal-content">
          <h3 style="margin-bottom: 15px;">✏️ تعديل بيانات الطلب والتوصيل</h3>
          <form id="editForm" method="POST" style="display: flex; flex-direction: column; gap: 12px;">
            <input type="text" id="edit_name" name="name" placeholder="الاسم" required>
            <input type="email" id="edit_email" name="email" placeholder="الإيميل">
            <input type="tel" id="edit_phone" name="phone" placeholder="الهاتف" required>
            <select id="edit_wilaya" name="wilaya" required>${wilayaOptions}</select>
            <input type="number" id="edit_amount" name="amount" placeholder="المبلغ" step="any" required>
            <select id="edit_courier" name="courier">${courierOptions}</select>
            <input type="text" id="edit_tracking" name="tracking" placeholder="رقم التتبع (Tracking)">
            <input type="text" id="edit_notes" name="notes" placeholder="ملاحظات">
            <select id="edit_status" name="status">
              <option value="جديد">جديد</option>
              <option value="قيد التأكيد">قيد التأكيد</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="ملغى">ملغى</option>
            </select>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <button type="submit" class="btn-primary" style="flex:1;">حفظ التغييرات</button>
              <button type="button" onclick="closeEditModal()" class="btn-action" style="flex:1; background:#ccc;">إلغاء</button>
            </div>
          </form>
        </div>
      </div>

      <script>
        const statusData = ${JSON.stringify(statusCounts)};
        const wilayaData = ${JSON.stringify(wilayaCounts)};

        new Chart(document.getElementById('statusChart'), {
          type: 'doughnut',
          data: {
            labels: Object.keys(statusData),
            datasets: [{ data: Object.values(statusData), backgroundColor: ['#05cd99', '#ffb800', '#3182ce', '#4318ff', '#e53935'] }]
          },
          options: { responsive: true }
        });

        new Chart(document.getElementById('wilayaChart'), {
          type: 'bar',
          data: {
            labels: Object.keys(wilayaData),
            datasets: [{ label: 'الطلبات', data: Object.values(wilayaData), backgroundColor: '#4318ff' }]
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('newLead') === 'true') {
          const toast = document.getElementById('toast');
          toast.style.display = 'block';
          setTimeout(() => { toast.style.display = 'none'; }, 4000);
        }

        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const rows = document.querySelectorAll('.lead-row');

        function filterTable() {
          const query = searchInput.value.toLowerCase().trim();
          const selectedStatus = statusFilter.value;

          rows.forEach(row => {
            const searchData = row.getAttribute('data-search');
            const statusData = row.getAttribute('data-status');
            const matchesSearch = searchData.includes(query);
            const matchesStatus = (selectedStatus === 'الكل') || (statusData === selectedStatus);
            row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
          });
        }

        searchInput.addEventListener('input', filterTable);
        statusFilter.addEventListener('change', filterTable);

        function openEditModal(lead) {
          document.getElementById('editForm').action = '/api/leads/update/' + lead.id;
          document.getElementById('edit_name').value = lead.name;
          document.getElementById('edit_email').value = lead.email || '';
          document.getElementById('edit_phone').value = lead.phone;
          document.getElementById('edit_wilaya').value = lead.wilaya;
          document.getElementById('edit_amount').value = lead.amount;
          document.getElementById('edit_courier').value = lead.courier || 'Yalidine Express';
          document.getElementById('edit_tracking').value = lead.tracking || '';
          document.getElementById('edit_notes').value = lead.notes || '';
          document.getElementById('edit_status').value = lead.status;
          document.getElementById('editModal').style.display = 'flex';
        }

        function closeEditModal() {
          document.getElementById('editModal').style.display = 'none';
        }
      </script>
    <!-- ================= 🏪 قسم إدارة منتجات المتجر ================= -->
    <div style="background: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 25px auto; max-width: 1200px; font-family: 'Segoe UI', sans-serif; direction: rtl; text-align: right;">
        <h3 style="color: #4f46e5; margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;">
            🛍️ إضافة منتج جديد للمتجر (dzShop)
        </h3>
        
        <form id="productForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="font-weight: 600; color: #4a5568;">اسم المنتج:</label>
                <input type="text" id="pName" placeholder="مثال: حافظة هاتف سامسونج" required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="font-weight: 600; color: #4a5568;">سعر البيع (د.ج):</label>
                <input type="number" id="pPrice" placeholder="مثال: 3500" required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="font-weight: 600; color: #4a5568;">السعر القديم قبل الخصم (اختياري):</label>
                <input type="number" id="pOldPrice" placeholder="مثال: 5000" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="font-weight: 600; color: #4a5568;">القسم:</label>
                <input type="text" id="pCategory" placeholder="مثال: إلكترونيات" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px; grid-column: 1 / -1;">
                <label style="font-weight: 600; color: #4a5568;">رابط صورة المنتج (Direct URL):</label>
                <input type="url" id="pImage" placeholder="https://i.ibb.co/..." required style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <label style="font-weight: 600; color: #4a5568;">الكمية في المخزون:</label>
                <input type="number" id="pStock" placeholder="مثال: 50" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
            </div>
            
            <button type="submit" style="grid-column: 1 / -1; background: #4f46e5; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 10px;">
                ✨ حفظ ونشر المنتج في المتجر
            </button>
        </form>
    </div>

    <script>
    document.getElementById("productForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById("pName").value,
            price: Number(document.getElementById("pPrice").value),
            oldPrice: Number(document.getElementById("pOldPrice").value) || 0,
            category: document.getElementById("pCategory").value || "عام",
            image: document.getElementById("pImage").value,
            stock: Number(document.getElementById("pStock").value) || 1,
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('تم إضافة المنتج ونشره في المتجر بنجاح ✅');
                document.getElementById("productForm").reset();
                location.reload();
            } else {
                alert("❌ حدث خطأ أثناء إضافة المنتج");
            }
        } catch (err) {
            console.error(err);
            alert("❌ فشل الاتصال بالسيرفر");
        }
    });
    </script>
    </body>
    </html>
  `);
});

connectDB().then(() => {
  
// ===== استقبال طلبات المتجر الإلكتروني =====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/api/store-order', async (req, res) => {
  try {
    const o = req.body || {};
    const leads = await (typeof readLeads !== "undefined" ? readLeads() : loadLeads());

    // 1. كشف ذكي لاسم المنتج وتفادي كلمة "طلب عام" الافتراضية
    let finalProduct = "";

    // إذا أرسل المتجر قائمة العناصر في السلة، نجمع أسماءها
    if (o.items && Array.isArray(o.items) && o.items.length > 0) {
        finalProduct = o.items.map(i => i.name).filter(Boolean).join(' + ');
    }

    // إذا لم نجد سلة، نأخذ الحقول البديلة بشرط ألا تكون "طلب عام"
    if (!finalProduct || finalProduct === "طلب عام") {
        finalProduct = o.product_name || o.product;
    }

    if (!finalProduct || finalProduct === "طلب عام") {
        finalProduct = (o.products && o.products !== "طلب عام") ? o.products : "طلب من المتجر";
    }

    const newLead = {
      id: Date.now(),
      name: o.name || 'زبون المتجر',
      phone: o.phone || '',
      email: o.email || '',
      wilaya: o.wilaya ? (o.wilaya + (o.address ? ' (' + o.address + ')' : '')) : 'غير محددة',
      address: o.address || '',
      product: finalProduct,
      productName: finalProduct,
      quantity: o.quantity || o.qty || 1,
      amount: Number(o.price) || Number(o.total) || Number(o.amount) || 0,
      cost: 0,
      profit: Number(o.price) || Number(o.total) || Number(o.amount) || 0,
      status: 'جديد',
      company: o.delivery || '',
      tracking: '',
      notes: (o.address ? '🏠 العنوان: ' + o.address + ' | ' : '') + 'طلب أونلاين ' + (o.orderId || '') + ' | ' + (o.payment || ''),
      source: 'المتجر الإلكتروني',
      date: new Date().toISOString()
    };

    leads.unshift(newLead);
    await saveLeads(leads);
    console.log('🛒 طلب جديد من المتجر:', newLead.name, newLead.amount);
    res.json({ ok: true, id: newLead.id });
  } catch (e) {
    console.error('❌ خطأ في طلب المتجر:', e);
        res.status(500).json({ ok: false, error: e.message });
  }
});

// ==================== 🛒 إدارة منتجات المتجر ====================
// تعريف موديل المنتج (Model)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    category: { type: String, default: 'عام' },
    image: { type: String, required: true },
    stock: { type: Number, default: 1 }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
// 1. جلب المنتجات للمتجر dzShop
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. إضافة منتج جديد
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. حذف منتج
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ==============================================================


app.listen(5000, () => {
    console.log("🚀 CRM System Running with Inventory Tracker on http://localhost:5000");
  });
}).catch(err => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
});


// Facebook Webhook Verification
app.get("/api/leads/webhook", (req, res) => {
  const VERIFY_TOKEN = "MY_CUSTOM_SECRET_TOKEN";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Facebook Incoming Lead Webhook
app.post("/api/leads/webhook", async (req, res) => {
  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging ? entry.messaging[0] : null;
      if (webhookEvent && webhookEvent.message) {
        const senderId = webhookEvent.sender.id;
        const messageText = webhookEvent.message.text || 'بدون نص';

        const leads = await readLeads();
        const newLead = {
          id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
          name: 'زبون Messenger',
          email: '',
          phone: senderId,
          wilaya: 'غير محددة',
          productName: 'طلب من Messenger',
          quantity: 1,
          amount: 0,
          cost: 0,
          profit: 0,
          courier: 'Yalidine Express',
          tracking: '',
          notes: messageText,
          status: 'جديد',
          createdAt: new Date().toISOString()
        };
        leads.unshift(newLead);
        await saveLeads(leads);
        console.log('زبون جديد من Messenger:', newLead);
        const replyText = generateSmartReply(messageText);
        await sendMessengerReply(senderId, replyText);
        const replyTextVal = generateSmartReply(messageText);
        await sendMessengerReply(senderId, replyTextVal);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else if (body.object === "ad_account") {
    console.log("New Facebook Lead:", JSON.stringify(body));
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});
