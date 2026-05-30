import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import generatorModule from '@babel/generator';
import t from '@babel/types';
import enAudit from './src/i18n/locales/en/auditText.js';
import arAudit from './src/i18n/locales/ar/auditText.js';

const traverse = traverseModule.default;
const generate = generatorModule.default;

const SRC_DIR = path.join(process.cwd(), 'src');

const getNamespaceForPath = (filePath) => {
  const p = filePath.toLowerCase();
  if (p.includes('\\admin\\') || p.includes('/admin/')) return 'admin';
  if (p.includes('\\driver\\') || p.includes('/driver/')) return 'driver';
  if (p.includes('\\marketplace\\') || p.includes('/marketplace/')) return 'marketplace';
  if (p.includes('\\mycoupons\\') || p.includes('/mycoupons/') || p.includes('coupon')) return 'coupons';
  if (p.includes('\\communitymedicines\\') || p.includes('/communitymedicines/') || p.includes('donation')) return 'donation';
  if (p.includes('\\cart\\') || p.includes('/cart/')) return 'cart';
  if (p.includes('\\checkout\\') || p.includes('/checkout/')) return 'checkout';
  if (p.includes('orders')) return 'orders';
  if (p.includes('medicines')) return 'medicines';
  if (p.includes('\\pharmacy\\') || p.includes('/pharmacy/') || p.includes('pharmacies')) return 'pharmacy';
  if (p.includes('notifications')) return 'notifications';
  if (p.includes('auth') || p.includes('login') || p.includes('register')) return 'auth';
  if (p.includes('dashboard')) return 'dashboard';
  if (p.includes('navbar') || p.includes('header')) return 'navbar';
  if (p.includes('home')) return 'home';
  return 'common';
};

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

const jsxFiles = getFiles(SRC_DIR).filter(f => !f.includes('\\i18n\\') && !f.includes('/i18n/'));

const namespaceStrings = {};

let modifiedCount = 0;

for (const file of jsxFiles) {
  const code = fs.readFileSync(file, 'utf8');
  if (!code.includes('useTranslation')) continue;

  const ns = getNamespaceForPath(file);
  if (!namespaceStrings[ns]) namespaceStrings[ns] = new Set();

  let ast;
  try {
    ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    continue;
  }

  let modified = false;

  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name === 'useTranslation') {
        if (path.node.arguments.length === 0) {
          path.node.arguments = [t.stringLiteral(ns)];
          modified = true;
        } else if (path.node.arguments[0].value === 'common' && ns !== 'common') {
          path.node.arguments[0] = t.stringLiteral(ns);
          modified = true;
        }
      }
      if (path.node.callee.name === 't' && path.node.arguments.length > 0 && path.node.arguments[0].type === 'StringLiteral') {
        const str = path.node.arguments[0].value;
        namespaceStrings[ns].add(str);
      }
    }
  });

  if (modified) {
    const output = generate(ast, { retainLines: false });
    fs.writeFileSync(file, output.code);
    modifiedCount++;
  }
}

console.log(`Updated ${modifiedCount} files with namespaces.`);

// Now write the namespaces to files
const writeLocales = (lang, dict) => {
  const dir = path.join(SRC_DIR, 'i18n', 'locales', lang);
  for (const ns of Object.keys(namespaceStrings)) {
    const keys = Array.from(namespaceStrings[ns]);
    if (keys.length === 0) continue;

    const nsFile = path.join(dir, `${ns}.js`);
    let existing = {};
    if (fs.existsSync(nsFile)) {
       try {
         // rudimentary extraction
         const content = fs.readFileSync(nsFile, 'utf8');
         // We will just overwrite with a new export default for simplicity, merging existing might be complex, 
         // but wait, we don't want to lose existing. 
       } catch(e) {}
    }

    const outObj = {};
    keys.sort().forEach(k => {
      outObj[k] = dict[k] || k;
    });

    const outContent = `const ${ns} = ${JSON.stringify(outObj, null, 2)};\n\nexport default ${ns};\n`;
    fs.writeFileSync(nsFile, outContent);
    console.log(`Wrote ${lang}/${ns}.js with ${keys.length} keys`);
  }
};

writeLocales('en', enAudit);
writeLocales('ar', arAudit);

