const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

if (c.includes('/api/store-order')) {
  console.log('⚠️ الـ endpoint موجود من قبل');
  process.exit(0);
}

const endpoint = `
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
    const leads = await loadLeads();
    const newLead = {
      id: Date.now(),
      name: o.name || 'زبون المتجر',
      phone: o.phone || '',
      email: o.email || '',
      wilaya: o.wilaya || 'غير محددة',
      address: o.address || '',
      product: o.products || 'طلب من المتجر',
      quantity: o.qty || 1,
      amount: Number(o.total) || 0,
      cost: 0,
      profit: Number(o.total) || 0,
      status: 'جديد',
      company: o.delivery || '',
      tracking: '',
      notes: 'طلب أونلاين ' + (o.orderId || '') + ' | ' + (o.payment || ''),
      source: 'المتجر الإلكتروني',
      date: new Date().toISOString()
    };
    leads.unshift(newLead);
    await saveLeads(leads);
    console.log('🛒 طلب جديد من المتجر:', newLead.name, newLead.amount);
    res.json({ ok: true, id: newLead.id });
  } catch (e) {
    console.error('خطأ في طلب المتجر:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});
`;

const anchor = c.includes('app.listen') ? 'app.listen' : null;
if (!anchor) { console.log('❌ ما لقيتش app.listen'); process.exit(1); }

const i = c.indexOf('app.listen');
c = c.slice(0, i) + endpoint + '\n' + c.slice(i);
fs.writeFileSync('server.js', c);
console.log('✅ تم إضافة endpoint المتجر بنجاح');
