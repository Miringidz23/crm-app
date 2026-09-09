const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');
if (content.indexOf('dotenv') === -1) {
  content = "require('dotenv').config();\n" + content;
  fs.writeFileSync('server.js', content);
  console.log('تم إضافة dotenv بنجاح');
} else {
  console.log('موجود من قبل');
}
