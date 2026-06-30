module.exports = {
  expo: {
    name: 'DraBornLife',
    slug: 'drabornlife',
    version: '0.2.9',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'drabornlife',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.draborneagle.drabornlife',
      versionCode: 29,
    },
    ios: {
      bundleIdentifier: 'com.draborneagle.drabornlife',
    },
    extra: {
      statusCode: 'v0.2.9',
      storageMode: 'local-only',
      cloudDatabase: false,
      apkFirstVersion: 'v1.0',
    },
  },
};
