# Build Options (Quick Notes)

## 1) Expo EAS (Recommended for quick APK)
- Install EAS: `npm i -g eas-cli`
- In `mobile/`, run: `eas login` (create account if needed)
- `eas build -p android --profile preview`
- Download the APK link that EAS provides.

## 2) Android Studio (bare)
- Run `npx expo prebuild` inside `mobile/` to create android/ folder.
- Open the `android/` folder in Android Studio, build a debug APK.
- Ensure `BASE_URL` points to your backend reachable IP.
