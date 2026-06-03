const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Clean dist
fs.rmSync(dist, { recursive: true, force: true });

// Copy src/ to dist/src/
copyDir(src, path.join(dist, 'src'));

// Create dist/index.js entry point
fs.writeFileSync(
  path.join(dist, 'index.js'),
  "const MixQL = require('./src/mixql');\nmodule.exports = MixQL;\n"
);

console.log('Build complete → dist/');
