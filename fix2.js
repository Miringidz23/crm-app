const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');
let changes = 0;

function replace(old, neu, allowMultiple = false) {
  const count = content.split(old).length - 1;
  if (count === 0) {
    console.log('❌ ما لقيتش:', old.substring(0, 50));
    return;
  }
  if (count > 1 && !allowMultiple) {
    console.log('⚠️ تكرر أكثر من مرة:', old.substring(0, 50));
  }
  content = content.split(old).join(neu);
  changes += count;
}

// 1. إضافة اتصال MongoDB بعد الـ requires
replace(
  `const app = express();`,
  `const { MongoClient } = require('mongodb');
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
let leadsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('crmapp');
  leadsCollection = db.collection('leads');
  console.log('✅ متصل بقاعدة بيانات MongoDB');
}

const app = express();`
);

// 2. تبديل دالتي readLeads و saveLeads
replace(
  `function readLeads() { return readData(DB_FILE, []); }
function saveLeads(leads) { saveData(DB_FILE, leads); }`,
  `async function readLeads() {
  return await leadsCollection.find({}).toArray();
}
async function saveLeads(leads) {
  await leadsCollection.deleteMany({});
  if (leads.length > 0) await leadsCollection.insertMany(leads);
}`
);

// 3. جعل الـ routes async + await
replace(`app.post('/api/leads', (req, res) => {`, `app.post('/api/leads', async (req, res) => {`);
replace(`app.post('/api/leads/update/:id', (req, res) => {`, `app.post('/api/leads/update/:id', async (req, res) => {`);
replace(`app.post('/api/leads/delete/:id', (req, res) => {`, `app.post('/api/leads/delete/:id', async (req, res) => {`);
replace(`app.get('/api/export', (req, res) => {`, `app.get('/api/export', async (req, res) => {`);
replace(`app.get('/invoice/:id', (req, res) => {`, `app.get('/invoice/:id', async (req, res) => {`);
replace(`app.get('/', (req, res) => {`, `app.get('/', async (req, res) => {`);
replace(`app.post("/api/leads/webhook", (req, res) => {`, `app.post("/api/leads/webhook", async (req, res) => {`);

// 4. إضافة await لجميع استدعاءات readLeads/saveLeads
replace(`const leads = readLeads();`, `const leads = await readLeads();`, true);
replace(`let leads = readLeads();`, `let leads = await readLeads();`, true);
replace(`saveLeads(leads);`, `await saveLeads(leads);`, true);

// 5. تعديل app.listen ليستنى الاتصال بقاعدة البيانات أولاً
replace(
  `app.listen(5000, () => {
  console.log("🚀 CRM System Running with Inventory Tracker on http://localhost:5000");
});`,
  `connectDB().then(() => {
  app.listen(5000, () => {
    console.log("🚀 CRM System Running with Inventory Tracker on http://localhost:5000");
  });
}).catch(err => {
  console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
});`
);

fs.writeFileSync('server.js', content);
console.log('✅ تم إجراء', changes, 'تعديل بنجاح');
