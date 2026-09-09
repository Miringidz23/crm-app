const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// تغيير const replyText المكررة إلى اسم جديد لتفادي التعارض
let seen = false;
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const replyText =')) {
    if (seen) {
      lines[i] = lines[i].replace('const replyText =', 'const replyTextVal =');
      if (lines[i+1] && lines[i+1].includes('replyText')) {
        lines[i+1] = lines[i+1].replace('replyText', 'replyTextVal');
      }
    } else {
      seen = true;
    }
  }
}

fs.writeFileSync('server.js', lines.join('\n'));
console.log('🔧 تم إصلاح التعارض بنجاح!');
