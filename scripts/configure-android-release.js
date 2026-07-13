const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (!fs.existsSync(gradlePath)) {
  throw new Error(`Android Gradle file not found: ${gradlePath}. Run expo prebuild first.`);
}

let src = fs.readFileSync(gradlePath, 'utf8');
const original = src;

if (!src.includes('DRABORNLIFE_KEYSTORE_PATH')) {
  const marker = '    buildTypes {';
  if (!src.includes(marker)) {
    throw new Error('Could not find buildTypes block in android/app/build.gradle');
  }

  const signingBlock = `    signingConfigs {\n        release {\n            def releaseStorePath = System.getenv("DRABORNLIFE_KEYSTORE_PATH")\n            def releaseStorePassword = System.getenv("DRABORNLIFE_KEYSTORE_PASSWORD")\n            def releaseKeyAlias = System.getenv("DRABORNLIFE_KEY_ALIAS")\n            def releaseKeyPassword = System.getenv("DRABORNLIFE_KEY_PASSWORD")\n\n            if (!releaseStorePath || !releaseStorePassword || !releaseKeyAlias || !releaseKeyPassword) {\n                throw new GradleException("DraBornLife release signing environment variables are missing")\n            }\n\n            storeFile file(releaseStorePath)\n            storePassword releaseStorePassword\n            keyAlias releaseKeyAlias\n            keyPassword releaseKeyPassword\n        }\n    }\n\n`;

  src = src.replace(marker, signingBlock + marker);
}

const releaseSigningRegex = /(release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/;
if (releaseSigningRegex.test(src)) {
  src = src.replace(releaseSigningRegex, '$1signingConfig signingConfigs.release');
} else if (!/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.release/.test(src)) {
  throw new Error('Could not switch the release buildType to the DraBornLife release signing config');
}

if (src !== original) {
  fs.writeFileSync(gradlePath, src);
  console.log('Android release signing configured for DraBornLife.');
} else {
  console.log('Android release signing was already configured.');
}
