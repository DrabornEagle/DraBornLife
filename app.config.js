module.exports = {
  expo: {
    name: 'DraBornLife',
    slug: 'drabornlife',
    version: '0.5.5',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'drabornlife',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.draborneagle.drabornlife',
      versionCode: 55,
    },
    ios: {
      bundleIdentifier: 'com.draborneagle.drabornlife',
    },
    extra: {
      statusCode: 'v0.5.5',
      storageMode: 'local-only',
      cloudDatabase: false,
      apkFirstVersion: 'v1.0',
    },
  },
};
