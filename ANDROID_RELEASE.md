# DraBornLife Android Release

DraBornLife v1.0.0 uses GitHub Actions to generate a signed Android release APK.

## Release identity

- Android package: `com.draborneagle.drabornlife`
- App version: `1.0.0`
- Android version code: `1`
- Permanent key alias: `drabornlife`

## First successful release

The first signed release APK and permanent keystore were generated successfully by GitHub Actions run `29258369163`.

The permanent keystore from that run must be used for every future DraBornLife APK/AAB update. Generating a different key would prevent Android from installing the build as an update to the existing app.

## Workflow

The workflow is stored at `.github/workflows/android-release-apk.yml` and is started manually with `workflow_dispatch`.

The workflow is locked to `stable-secrets` signing. It will stop with an error rather than generate a new key when signing secrets are missing.

## Required GitHub Actions Secrets

- `DRABORNLIFE_KEYSTORE_BASE64`
- `DRABORNLIFE_KEYSTORE_PASSWORD`
- `DRABORNLIFE_KEY_ALIAS`
- `DRABORNLIFE_KEY_PASSWORD`

The first secret is the Base64 representation of `drabornlife-release.jks`. The remaining values are stored in the private v1.0.0 keystore backup package.

The keystore, passwords and Base64 value must never be committed to this public repository.
