const fs = require('fs');
let token = fs.readFileSync('token.txt', 'utf8');
token = token.replace(/\s+/g, '');
fs.appendFileSync('.env', '\nPAGE_ACCESS_TOKEN=' + token + '\n');
fs.unlinkSync('token.txt');
console.log('تم بنجاح، طول التوكن:', token.length);
