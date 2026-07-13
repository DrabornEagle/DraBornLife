const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (!fs.existsSync(gradlePath)) {
  throw new Error(`Android Gradle file not found: ${gradlePath}. Run expo prebuild first.`);
}

let src = fs.readFileSync(gradlePath, 'utf8');
const original = src;

const buildTypesMarker = '    buildTypes {';
if (!src.includes(buildTypesMarker)) {
  throw new Error('Could not find buildTypes block in android/app/build.gradle');
}

if (!src.includes('DRABORNLIFE_KEYSTORE_PATH')) {
  const signingBlock = `    signingConfigs {\n        release {\n            def releaseStorePath = System.getenv("DRABORNLIFE_KEYSTORE_PATH")\n            def releaseStorePassword = System.getenv("DRABORNLIFE_KEYSTORE_PASSWORD")\n            def releaseKeyAlias = System.getenv("DRABORNLIFE_KEY_ALIAS")\n            def releaseKeyPassword = System.getenv("DRABORNLIFE_KEY_PASSWORD")\n\n            if (!releaseStorePath || !releaseStorePassword || !releaseKeyAlias || !releaseKeyPassword) {\n                throw new GradleException("DraBornLife release signing environment variables are missing")\n            }\n\n            storeFile file(releaseStorePath)\n            storePassword releaseStorePassword\n            keyAlias releaseKeyAlias\n            keyPassword releaseKeyPassword\n        }\n    }\n\n`;

  src = src.replace(buildTypesMarker, signingBlock + buildTypesMarker);
}

function findMatchingBrace(text, openingBraceIndex) {
  let depth = 0;
  for (let index = openingBraceIndex; index < text.length; index += 1) {
    if (text[index] === '{') depth += 1;
    if (text[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

const buildTypesIndex = src.indexOf(buildTypesMarker);
const releaseIndex = src.indexOf('release {', buildTypesIndex);
if (releaseIndex === -1) {
  throw new Error('Could not find release buildType in android/app/build.gradle');
}

const releaseOpeningBrace = src.indexOf('{', releaseIndex);
const releaseClosingBrace = findMatchingBrace(src, releaseOpeningBrace);
if (releaseClosingBrace === -1) {
  throw new Error('Could not determine the end of the release buildType');
}

const releaseBlock = src.slice(releaseIndex, releaseClosingBrace + 1);
let updatedReleaseBlock = releaseBlock;

if (/signingConfig\s+signingConfigs\.debug/.test(updatedReleaseBlock)) {
  updatedReleaseBlock = updatedReleaseBlock.replace(
    /signingConfig\s+signingConfigs\.debug/,
    'signingConfig signingConfigs.release',
  );
} else if (!/signingConfig\s+signingConfigs\.release/.test(updatedReleaseBlock)) {
  throw new Error('Could not switch the release buildType to the DraBornLife release signing config');
}

src =
  src.slice(0, releaseIndex) +
  updatedReleaseBlock +
  src.slice(releaseClosingBrace + 1);

const finalBuildTypesIndex = src.indexOf(buildTypesMarker);
const finalReleaseIndex = src.indexOf('release {', finalBuildTypesIndex);
const finalReleaseOpeningBrace = src.indexOf('{', finalReleaseIndex);
const finalReleaseClosingBrace = findMatchingBrace(src, finalReleaseOpeningBrace);
const finalReleaseBlock = src.slice(finalReleaseIndex, finalReleaseClosingBrace + 1);

if (!/signingConfig\s+signingConfigs\.release/.test(finalReleaseBlock)) {
  throw new Error('Release buildType is not configured with the DraBornLife release key');
}

if (src !== original) {
  fs.writeFileSync(gradlePath, src);
  console.log('Android release signing configured for DraBornLife.');
} else {
  console.log('Android release signing was already configured.');
}
