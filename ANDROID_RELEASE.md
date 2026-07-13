# DraBornLife Android Release

DraBornLife Android releases are generated through GitHub Actions and must use the permanent v1.0.1 signing key.

## Current release identity

- Android package: `com.draborneagle.drabornlife`
- App version: `1.0.2`
- Android version code: `3`
- Permanent key alias: `drabornlife`
- JavaScript engine: Hermes
- React Native New Architecture: disabled

## v1.0.2 branding update

DraBornLife v1.0.2 adds the approved DraBornLife app icon and the approved vertical splash artwork without generating replacement images.

The Android configuration now includes:

- Standard application icon
- Android adaptive icon
- Native static splash artwork
- Animated loading overlay with a rotating cyan/gold ring
- Pulsing glow
- Staggered loading dots
- Entrance movement and a smooth fade into the main application

The application loads underneath the animation, so the animation does not postpone application initialization.

## v1.0.2 validation

GitHub Actions run `29273336569` successfully validated the self-contained release build.

Validation completed successfully:

- Approved icon checksum: verified
- Approved splash checksum: verified
- Expo Doctor: passed
- Android native prebuild: passed
- Self-contained release APK build: passed
- Bundled JavaScript loaded without Metro
- Animated splash screenshot captured after one second
- Main application screenshot captured after the transition
- Application process remained alive
- No DraBornLife fatal exception was found in Android logcat

The validation APK uses a temporary test key and must not be distributed as the production update.

## Permanent signing rule

Every production DraBornLife APK/AAB update must use the permanent v1.0.1 keystore. Generating another key would prevent Android from installing the build as an update to the current app.

The production workflow is stored at `.github/workflows/android-release-apk.yml` and is started manually with `workflow_dispatch`.

The workflow stops with an error rather than generating a replacement key when signing secrets are missing.

## Required GitHub Actions Secrets

- `DRABORNLIFE_KEYSTORE_BASE64`
- `DRABORNLIFE_KEYSTORE_PASSWORD`
- `DRABORNLIFE_KEY_ALIAS`
- `DRABORNLIFE_KEY_PASSWORD`

The values are stored in the private `DraBornLife-v1.0.1-keystore-backup.zip` package. The keystore, passwords, private recovery key and Base64 value must never be committed to this public repository.

The v1.0.0 APK and its signing key must not be used.
