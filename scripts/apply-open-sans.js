// Run: node .\scripts\apply-open-sans.js
// This script replaces occurrences of `fontWeight: ...` in .ts/.tsx files with a corresponding
// Open Sans fontFamily (OpenSans_700Bold, OpenSans_600SemiBold, OpenSans_400Regular).
// It edits files in-place and prints which files were changed.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // repo root
const exts = ['.tsx', '.ts'];

function walk(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // skip node_modules and .git
      if (name === 'node_modules' || name === '.git') continue;
      res.push(...walk(full));
    } else if (exts.includes(path.extname(name))) {
      res.push(full);
    }
  }
  return res;
}

function pickFamily(weight) {
  const w = String(weight).toLowerCase();
  if (w === '700' || w === 'bold') return 'OpenSans_700Bold';
  if (w === '600' || w === 'semibold' || w === '600semi') return 'OpenSans_600SemiBold';
  // default fallback
  return 'OpenSans_400Regular';
}

const files = walk(root);
let changedFiles = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace `fontWeight: 700,` or `fontWeight: '700',` or `fontWeight: "bold",`
  const fontWeightRegex = /fontWeight\s*:\s*(['"]?)([0-9]+|[A-Za-z\-]+)\1\s*,?/g;

  content = content.replace(fontWeightRegex, (match, quote, weight) => {
    const fam = pickFamily(weight);
    // Keep trailing comma for proper object formatting
    return `fontFamily: '${fam}',`;
  });

  // If some styles ended up with duplicated commas or ",," clean up occurrences of ",," -> ","
  content = content.replace(/,\s*,/g, ',');

  // If fontFamily already present in same style block with different value, we keep both -- manual check recommended.
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', path.relative(root, file));
    changedFiles++;
  }
});

console.log(`Done. Files changed: ${changedFiles}`);