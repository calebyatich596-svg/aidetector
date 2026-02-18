# VerifiAI Mobile (Expo + TypeScript)

Production-ready React Native scaffold for iOS + Android with:

- Secure JWT auth (`expo-secure-store`)
- Biometric unlock (`expo-local-authentication`)
- Camera + gallery image upload (`expo-image-picker`)
- Detection API integration (`axios`)
- Stripe mobile billing hook (`@stripe/stripe-react-native`)
- Push notification registration (`expo-notifications`)

## Setup

```bash
npm install
npm run start
```

## Build

```bash
npx eas build --platform android
npx eas build --platform ios
```

## Environment

- Update API URL in `app/config.ts`
- Replace Stripe key in `app/config.ts`
- Connect push token upload in `app/services/notifications.ts`

## Screen Flow

- `Login` -> `Dashboard`
- `Register` -> back to `Login`
- `Dashboard` -> `Result`
