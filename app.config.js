module.exports = {
  expo: {
    name: 'DraBornLife',
    slug: 'drabornlife',
    version: '0.3.6',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'drabornlife',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.draborneagle.drabornlife',
      versionCode: 36,
    },
    ios: {
      bundleIdentifier: 'com.draborneagle.drabornlife',
    },
    extra: {
      statusCode: 'v0.3.6',
      storageMode: 'local-only',
      cloudDatabase: false,
      apkFirstVersion: 'v1.0',
    },
  },
};
