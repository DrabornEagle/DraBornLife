# DraBornLife Android Release

DraBornLife v1.0.1 uses GitHub Actions to generate a signed Android release APK and optionally cold-start it on an Android emulator.

## Release identity

- Android package: `com.draborneagle.drabornlife`
- App version: `1.0.1`
- Android version code: `2`
- Permanent key alias: `drabornlife`

## Tested first usable release

The corrected signed APK and its permanent keystore were generated and validated by GitHub Actions run `29266888153`.

Validation completed successfully:

- Expo Doctor: 18/18 checks passed
- Android release APK build: passed
- Signed APK installation: passed
- Cold start of `com.draborneagle.drabornlife/.MainActivity`: passed
- App process stayed alive after 20 seconds
- No DraBornLife fatal exception was found in Android logcat
- Startup screenshot and diagnostic logs were captured

The v1.0.0 APK must not be used. Its startup configuration was defective and it used a different signing key.

## Permanent signing rule

Every future DraBornLife APK/AAB update must use the v1.0.1 keystore. Generating another key would prevent Android from installing future builds as updates to this tested release.

The workflow is stored at `.github/workflows/android-release-apk.yml` and is started manually with `workflow_dispatch`.

The workflow is locked to the permanent signing secrets. It stops with an error rather than generating a replacement key when any secret is missing.

## Required GitHub Actions Secrets

- `DRABORNLIFE_KEYSTORE_BASE64`
- `DRABORNLIFE_KEYSTORE_PASSWORD`
- `DRABORNLIFE_KEY_ALIAS`
- `DRABORNLIFE_KEY_PASSWORD`

The Base64 and password values are stored in the private `DraBornLife-v1.0.1-keystore-backup.zip` package. The keystore, passwords, private recovery key and Base64 value must never be committed to this public repository.
