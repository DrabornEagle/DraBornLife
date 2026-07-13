const fs = require('fs');
const path = require('path');

try {
  require('./apply-v100-release');
} catch (err) {
  console.warn('v1.0.0 release fixes could not run:', err && err.message ? err.message : err);
}

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');
const original = src;

src = src.replace("const VERSION = 'v1.0.0';", "const VERSION = 'v1.0.1';");
src = src.replace("const VERSION = 'v0.3.16';", "const VERSION = 'v1.0.1';");
src = src.split('v1.0.0 ilk kararlı APK').join('v1.0.1 açılış kararlılık düzeltmesi');

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v1.0.1 startup fixes applied.');
} else {
  console.log('DraBornLife v1.0.1 startup fixes already applied.');
}
