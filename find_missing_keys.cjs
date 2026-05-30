const fs = require('fs');
const path = require('path');

const getFiles = (dir) => {
  let res = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(getFiles(full));
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      res.push(full);
    }
  }
  return res;
};

const files = getFiles(path.join(process.cwd(), 'src'));
const keys = new Set();
const keyRegex = /t\(['"]([^'"]+)['"]\)/g;

for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = keyRegex.exec(code)) !== null) {
    keys.add(match[1]);
  }
}

const missingKeys = Array.from(keys).filter(k => k.includes('.') || k.match(/^[a-z]+[A-Z][a-zA-Z]*$/)); // Catch dots or camelCase
console.log(JSON.stringify(missingKeys, null, 2));
