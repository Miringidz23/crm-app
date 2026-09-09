const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const old = `body.entry.forEach(entry => {`;
const neu = `body.entry.forEach(async (entry) => {`;

if (content.indexOf(old) !== -1) {
  content = content.split(old).join(neu);
  fs.writeFileSync('server.js', content);
  console.log('تم الإصلاح بنجاح');
} else {
  console.log('ما لقيتش النص');
}
