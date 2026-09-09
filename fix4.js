const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const senderFunction = "\nasync function sendMessengerReply(senderId, text) {\n  try {\n    const url = 'https://graph.facebook.com/v20.0/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;\n    await fetch(url, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        recipient: { id: senderId },\n        message: { text: text }\n      })\n    });\n  } catch (e) {\n    console.error('فشل إرسال الرد:', e.message);\n  }\n}\n\nfunction generateSmartReply(messageText) {\n  const msg = messageText.toLowerCase();\n  if (msg.includes('سلام') || msg.includes('صباح') || msg.includes('مرحبا') || msg.includes('اهلا')) {\n    return 'أهلاً وسهلاً بيك 👋 شكراً لتواصلك معنا. كيفاش نقدر نعاونك اليوم؟';\n  }\n  if (msg.includes('سعر') || msg.includes('ثمن') || msg.includes('بشحال')) {\n    return 'شكراً على اهتمامك! راح نتصلو بيك قريباً باش نعطيوك كل التفاصيل على السعر والمنتج 💰';\n  }\n  if (msg.includes('طلب') || msg.includes('نحب نشري') || msg.includes('نبغي')) {\n    return 'تم استلام طلبك بنجاح ✅ فريقنا راح يتواصل معاك في أقرب وقت لتأكيد الطلب.';\n  }\n  return 'شكراً لرسالتك 🙏 توصلنا بيها وراح نرد عليك في أقرب وقت ممكن.';\n}\n";

content = content.replace('const app = express();', senderFunction + '\nconst app = express();');

const oldCall = "leads.unshift(newLead);\n        await saveLeads(leads);\n        console.log('زبون جديد من Messenger:', newLead);";

const newCall = "leads.unshift(newLead);\n        await saveLeads(leads);\n        console.log('زبون جديد من Messenger:', newLead);\n        const replyText = generateSmartReply(messageText);\n        await sendMessengerReply(senderId, replyText);";

if (content.indexOf(oldCall) !== -1) {
  content = content.split(oldCall).join(newCall);
  fs.writeFileSync('server.js', content);
  console.log('تم إضافة الرد الذكي بنجاح');
} else {
  console.log('تحذير: ما لقيتش نص الاستدعاء');
}
