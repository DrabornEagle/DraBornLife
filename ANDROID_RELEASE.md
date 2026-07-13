# DraBornLife Android Release

DraBornLife v1.0.0 uses GitHub Actions to generate a signed Android release APK.

## Release identity

- Android package: `com.draborneagle.drabornlife`
- App version: `1.0.0`
- Android version code: `1`
- Key alias: `drabornlife`

## Workflow

The workflow is stored at `.github/workflows/android-release-apk.yml`.

It supports two signing modes:

1. `stable-secrets`: uses the permanent keystore stored through GitHub Actions Secrets.
2. `bootstrap-generated`: generates the first keystore during the initial v1.0.0 build and uploads an encrypted recovery bundle.

The keystore must never be committed to the repository. Future releases must use the same permanent keystore so Android recognizes updates as belonging to the same app.

## Required GitHub Actions Secrets for permanent signing

- `DRABORNLIFE_KEYSTORE_BASE64`
- `DRABORNLIFE_KEYSTORE_PASSWORD`
- `DRABORNLIFE_KEY_ALIAS`
- `DRABORNLIFE_KEY_PASSWORD`

The first secret is the Base64 representation of `drabornlife-release.jks`. The remaining values come from the recovered credentials file.
