const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const oldBlock = `// Facebook Incoming Lead Webhook
app.post("/api/leads/webhook", (req, res) => {
  const body = req.body;
  if (body.object === "page" || body.object === "ad_account") {
    console.log("New Facebook Lead:", JSON.stringify(body));
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});`;

const newBlock = `// Facebook Incoming Lead Webhook
app.post("/api/leads/webhook", (req, res) => {
  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging ? entry.messaging[0] : null;
      if (webhookEvent && webhookEvent.message) {
        const senderId = webhookEvent.sender.id;
        const messageText = webhookEvent.message.text || 'بدون نص';

        const leads = readLeads();
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
        saveLeads(leads);
        console.log('زبون جديد من Messenger:', newLead);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else if (body.object === "ad_account") {
    console.log("New Facebook Lead:", JSON.stringify(body));
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('server.js', content);
  console.log('✅ تم التعديل بنجاح');
} else {
  console.log('❌ ما لقيتش النص القديم - راجع الكود يدويًا');
}
