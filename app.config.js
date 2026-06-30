module.exports = {
  expo: {
    name: 'DraBornLife',
    slug: 'drabornlife',
    version: '0.2.5',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'drabornlife',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.draborneagle.drabornlife',
      versionCode: 25,
    },
    ios: {
      bundleIdentifier: 'com.draborneagle.drabornlife',
    },
    extra: {
      statusCode: 'v0.2.5',
      storageMode: 'local-only',
      cloudDatabase: false,
      apkFirstVersion: 'v1.0',
    },
  },
};
