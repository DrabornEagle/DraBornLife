module.exports = {
  expo: {
    name: 'DraBornLife',
    slug: 'drabornlife',
    version: '1.4.6',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    scheme: 'drabornlife',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.draborneagle.drabornlife',
      versionCode: 58,
    },
    ios: {
      bundleIdentifier: 'com.draborneagle.drabornlife',
    },
    extra: {
      statusCode: 'v1.4.6',
      stabilizationPhaseClosed: true,
      storageMode: 'local-only',
      cloudDatabase: false,
      apkBuildMode: 'manual-only',
      apkBuildAllowed: false,
      designPhaseClosed: true,
      testTabHidden: true,
    },
  },
};
