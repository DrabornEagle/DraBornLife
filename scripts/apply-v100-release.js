const fs = require('fs');
const path = require('path');

try {
  require('./apply-v0316-fixes');
} catch (err) {
  console.warn('v0.3.16 base fixes could not run:', err && err.message ? err.message : err);
}

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');
const original = src;

const versionPatterns = [
  "const VERSION = 'v0.3.16';",
  "const VERSION = 'v0.3.15';",
  "const VERSION = 'v0.3.14';",
  "const VERSION = 'v0.3.13';",
  "const VERSION = 'v0.3.10';",
];

for (const pattern of versionPatterns) {
  if (src.includes(pattern)) {
    src = src.replace(pattern, "const VERSION = 'v1.0.0';");
    break;
  }
}

const labels = [
  'v0.3.16 arayüz düzeltme',
  'v0.3.15 kurulum düzeltme',
  'v0.3.14 finans düzeni',
  'v0.3.13 favori düzeltme',
  'v0.3.10 birikim dağıtımı',
];

for (const label of labels) {
  src = src.split(label).join('v1.0.0 ilk kararlı APK');
}

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v1.0.0 release metadata applied.');
} else {
  console.log('DraBornLife v1.0.0 release metadata already applied.');
}
