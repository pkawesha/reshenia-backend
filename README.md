# Reshenia Opportunities — Final Setup (v1)

This package contains a **backend (Node/Express)** and a **mobile app (Expo React Native)** with
configs for **Chilimba (village banking)**, **WhatsApp group activation**, **commission & viewing fees**, 
and **mobile money placeholders** (Airtel, MTN, Zamtel, Zanaco).

**Default ports**
- Backend API: `http://localhost:4001`
- Expo Metro (mobile): dynamic (Expo CLI will show)

## Quick Start (Windows-friendly)

### 0) Requirements
- Node.js 18+ and npm
- Git (optional)
- Android Studio (for an emulator) or a real Android phone with Expo Go installed
- MySQL 8 (or MariaDB 10.5+) — optional for first run; API starts with in-memory store

### 1) Backend
```bash
cd backend
copy .env.example .env
# edit .env (DB credentials, payment numbers, etc.)
npm install
npm run dev   # starts on http://localhost:4001
```
Health check: open http://localhost:4001/health

#### MySQL (optional now; recommended for production)
- Import `src/db/schema.sql` into your DB and update `.env` connection vars.
- Set `DB_ENABLED=true` in `.env` to enable MySQL storage.

### 2) Mobile app (Expo)
```bash
cd ../mobile
npm install
npm start
```
- Scan the QR code with Expo Go on your Android phone, or press **a** to launch Android emulator.
- If testing from Android emulator, set `BASE_URL=http://10.0.2.2:4001` in `mobile/.env` (create) or in `lib/api.js`.
- If testing from a phone on Wi‑Fi, use your PC’s LAN IP: e.g., `http://192.168.1.23:4001`.

### 3) Postman
Import `tools/postman/Reshenia_Backend.postman_collection.json` and hit **Health** and **Auth** endpoints.

## Features included
- **Chilimba banner + “What is Chilimba?” modal** on Home screen.
- **WhatsApp groups**: activation flow + monthly fee placeholder.
- **Listings**: services/goods categories, accommodation, hotel rooms, car hire, land/houses/plots.
- **Viewing fee lock**: contact details hidden until paid/unlocked.
- **Commission config** for transactions and referrals.
- **Policies & Disclaimers (Zambia + COMESA-aware)** in `/legal/disclaimers.md`.
- **Removed PayPal** (kept placeholders for Mobile Money).
- **API helper** (`fetchJSON` + `API`) included and wired.

## Build APK (bare minimum)
For quick sharing during testing you can use **EAS Build** (Expo), or eject and use Android Studio.
See comments in `mobile/README-build.md` (not required for dev).

---

© 2025 Reshenia Opportunities. For support contact: **Pius Kawesha**.
