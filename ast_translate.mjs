import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import generatorModule from '@babel/generator';
import t from '@babel/types';
import auditText from './src/i18n/locales/en/auditText.js';

const traverse = traverseModule.default;
const generate = generatorModule.default;

const SRC_DIR = path.join(process.cwd(), 'src');
const keys = Object.keys(auditText);
const keySet = new Set(keys);

// Find longest keys first to avoid partial replacements
keys.sort((a, b) => b.length - a.length);

const getFiles = (dir) => {
  let res = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(getFiles(full));
    } else if (full.endsWith('.jsx')) {
      res.push(full);
    }
  }
  return res;
};

const jsxFiles = getFiles(SRC_DIR);

let totalReplaced = 0;

for (const file of jsxFiles) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });
  } catch (e) {
    console.error('Failed to parse', file, e);
    continue;
  }

  let needsTranslation = false;
  let hasUseTranslationImport = false;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react-i18next') {
        hasUseTranslationImport = true;
      }
    },
    JSXText(path) {
      const text = path.node.value;
      const trimmed = text.trim().replace(/\s+/g, ' ');
      if (keySet.has(trimmed)) {
        needsTranslation = true;
        path.replaceWith(
          t.jsxExpressionContainer(
            t.callExpression(t.identifier('t'), [t.stringLiteral(trimmed)])
          )
        );
      }
    },
    JSXAttribute(path) {
      if (['title', 'placeholder', 'aria-label'].includes(path.node.name.name)) {
        if (path.node.value && path.node.value.type === 'StringLiteral') {
          const text = path.node.value.value.trim().replace(/\s+/g, ' ');
          if (keySet.has(text)) {
            needsTranslation = true;
            path.node.value = t.jsxExpressionContainer(
              t.callExpression(t.identifier('t'), [t.stringLiteral(text)])
            );
          }
        }
      }
    },
    StringLiteral(path) {
      // Look for strings inside JSX Expressions
      if (path.parent.type === 'JSXExpressionContainer' || path.parent.type === 'LogicalExpression' || path.parent.type === 'ConditionalExpression') {
        if (path.findParent(p => p.isJSXElement())) {
          const text = path.node.value.trim().replace(/\s+/g, ' ');
          if (keySet.has(text) && path.parent.callee?.name !== 't') {
            needsTranslation = true;
            path.replaceWith(
              t.callExpression(t.identifier('t'), [t.stringLiteral(text)])
            );
            path.skip();
          }
        }
      }
    }
  });

  if (needsTranslation) {
    // Add import { useTranslation } from 'react-i18next'
    if (!hasUseTranslationImport) {
      const importDecl = t.importDeclaration(
        [t.importSpecifier(t.identifier('useTranslation'), t.identifier('useTranslation'))],
        t.stringLiteral('react-i18next')
      );
      ast.program.body.unshift(importDecl);
    }

    // Add const { t } = useTranslation(); to top-level functions that return JSX
    traverse(ast, {
      FunctionDeclaration(path) {
        let hasJSX = false;
        path.traverse({
          JSXElement() { hasJSX = true; }
        });
        if (hasJSX) {
          const hasT = path.scope.hasBinding('t');
          if (!hasT) {
            const hookCall = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.objectPattern([
                  t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)
                ]),
                t.callExpression(t.identifier('useTranslation'), [])
              )
            ]);
            path.get('body').unshiftContainer('body', hookCall);
          }
        }
      },
      ArrowFunctionExpression(path) {
        if (path.parent.type === 'VariableDeclarator' && path.parent.id.name.match(/^[A-Z]/)) {
          let hasJSX = false;
          path.traverse({
            JSXElement() { hasJSX = true; }
          });
          if (hasJSX) {
             const hasT = path.scope.hasBinding('t');
             if (!hasT && path.node.body.type === 'BlockStatement') {
                const hookCall = t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.objectPattern([
                      t.objectProperty(t.identifier('t'), t.identifier('t'), false, true)
                    ]),
                    t.callExpression(t.identifier('useTranslation'), [])
                  )
                ]);
                path.get('body').unshiftContainer('body', hookCall);
             }
          }
        }
      }
    });

    const output = generate(ast, { retainLines: false, retainFunctionParens: true });
    // Write back
    // We will do formatting later if needed
    fs.writeFileSync(file, output.code);
    totalReplaced++;
  }
}

console.log('Done! Modified files:', totalReplaced);
