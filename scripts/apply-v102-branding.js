const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

try {
  require('./apply-v101-startup-fix');
} catch (error) {
  console.warn(
    'v1.0.1 fixes could not run:',
    error && error.message ? error.message : error,
  );
}

const root = path.join(__dirname, '..');
const sourceDirectory = path.join(root, 'assets-src', 'v102');
const assetsDirectory = path.join(root, 'assets');

function decodeAssetChunks(prefix, outputName) {
  const chunkFiles = fs
    .readdirSync(sourceDirectory)
    .filter((name) => name.startsWith(`${prefix}.`) && name.endsWith('.b64'))
    .sort();

  if (!chunkFiles.length) {
    throw new Error(`Missing DraBornLife ${prefix} asset chunks.`);
  }

  const base64 = chunkFiles
    .map((name) =>
      fs.readFileSync(path.join(sourceDirectory, name), 'utf8').trim(),
    )
    .join('');

  fs.mkdirSync(assetsDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(assetsDirectory, outputName),
    Buffer.from(base64, 'base64'),
  );
}

function createNativeSplashPng() {
  const jpegPath = path.join(assetsDirectory, 'splash-v102.jpg');
  const pngPath = path.join(assetsDirectory, 'splash-v102.png');
  const decoded = jpeg.decode(fs.readFileSync(jpegPath), {
    useTArray: true,
    formatAsRGBA: true,
  });

  if (!decoded.width || !decoded.height || !decoded.data) {
    throw new Error('DraBornLife splash JPEG could not be decoded.');
  }

  const pngBuffer = PNG.sync.write({
    width: decoded.width,
    height: decoded.height,
    data: Buffer.from(decoded.data),
  });

  fs.writeFileSync(pngPath, pngBuffer);

  const signature = fs.readFileSync(pngPath).subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error('DraBornLife native splash PNG generation failed.');
  }
}

decodeAssetChunks('icon', 'icon-v102.png');
decodeAssetChunks('splash', 'splash-v102.jpg');
createNativeSplashPng();

const appPath = path.join(root, 'App.js');
let source = fs.readFileSync(appPath, 'utf8');
const original = source;

source = source.replace(
  /const VERSION = 'v[^']+';/,
  "const VERSION = 'v1.0.2';",
);
source = source
  .split('v1.0.1 açılış kararlılık düzeltmesi')
  .join('v1.0.2 ikon ve animasyonlu açılış');
source = source
  .split('v1.0.0 ilk kararlı APK')
  .join('v1.0.2 ikon ve animasyonlu açılış');

if (source !== original) {
  fs.writeFileSync(appPath, source);
}

console.log('DraBornLife v1.0.2 branding assets and native splash PNG applied.');
