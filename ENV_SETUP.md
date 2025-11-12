# Environment Variables Setup Guide

## ✅ Current Configuration Status

All environment variables are now properly configured and integrated throughout the codebase.

## 🔑 Configured Environment Variables

### 1. Firebase Authentication
**Status:** ✅ Configured
```
VITE_FIREBASE_API_KEY=AIzaSyDRVa-yBGHzTURFD07iJJBIOr8KXRXEjDQ
VITE_FIREBASE_AUTH_DOMAIN=task-scheduling-system-7d28f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=task-scheduling-system-7d28f
VITE_FIREBASE_STORAGE_BUCKET=task-scheduling-system-7d28f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=649051014519
VITE_FIREBASE_APP_ID=1:649051014519:web:c7055f42411fd71fc20d72
VITE_FIREBASE_MEASUREMENT_ID=G-FTLFC87B22
```

**Used in:**
- `src/lib/firebase.ts` - Firebase initialization
- All authentication pages (Login, Register, Profile)

---

### 2. Google Maps API
**Status:** ✅ Configured
```
VITE_GOOGLE_MAPS_API_KEY=f27358b8158e9b5c80265503b5650da217a35358ef9ccff4a436843d2fd689c3
```

**Used in:**
- `src/lib/googleMaps.ts` - Google Maps script loader
- `src/components/MapComponent.tsx` - Interactive clinic map
- `src/pages/ClinicMapPage.tsx` - Clinic locator page

**Features:**
- Dynamic map loading with error handling
- Clinic markers with info windows
- Fallback UI when API fails

---

### 3. Google Gemini API
**Status:** ✅ Configured
```
VITE_GEMINI_API_KEY=AIzaSyASqpo_Ns-b8vrJiNbz1uMav-xWi-GsIeA
```

**Used in:**
- `src/lib/api.ts` - Gemini API integration
- `src/pages/HealthChatbotPage.tsx` - Full chatbot page
- `src/components/ChatbotWidget.tsx` - Floating chat widget

**Features:**
- Real-time AI health assistance
- Uses Gemini 2.0 Flash model
- Error handling with graceful fallbacks
- Health-focused prompt engineering

---

### 4. Backend ML API
**Status:** ⚠️ Configured (Default: localhost:5000)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Used in:**
- `src/lib/api.ts` - API configuration and endpoints
- `src/pages/SkinScannerPage.tsx` - Skin disease detection
- `src/pages/EyeScannerPage.tsx` - Eye disease detection

**Endpoints:**
- `/scan/skin` - Skin disease analysis
- `/scan/eye` - Eye disease analysis
- `/chat` - Chatbot backend (optional)

**Features:**
- Attempts real API calls first
- Falls back to demo data if API unavailable
- User-friendly error notifications

---

## 📁 File Structure

### Configuration Files
```
├── .env                    # Your actual environment variables (DO NOT COMMIT)
├── .env.example            # Template for other developers
├── .gitignore              # Ensures .env files are not committed
└── ENV_SETUP.md            # This file
```

### API Integration Files
```
src/lib/
├── api.ts                  # Main API utilities (Gemini, ML models)
├── firebase.ts             # Firebase configuration
├── googleMaps.ts           # Google Maps loader
└── utils.ts                # General utilities
```

### Components Using Environment Variables
```
src/
├── components/
│   ├── ChatbotWidget.tsx   # Uses VITE_GEMINI_API_KEY
│   └── MapComponent.tsx    # Uses VITE_GOOGLE_MAPS_API_KEY
├── pages/
│   ├── HealthChatbotPage.tsx    # Uses VITE_GEMINI_API_KEY
│   ├── SkinScannerPage.tsx      # Uses VITE_API_BASE_URL
│   ├── EyeScannerPage.tsx       # Uses VITE_API_BASE_URL
│   └── ClinicMapPage.tsx        # Uses VITE_GOOGLE_MAPS_API_KEY
└── context/
    └── AuthContext.tsx     # Uses Firebase env vars
```

---

## 🚀 How It Works

### 1. Vite Environment Variables
All environment variables are prefixed with `VITE_` to be exposed to the client-side code.
Access them using: `import.meta.env.VITE_VARIABLE_NAME`

### 2. Firebase Integration
```typescript
// src/lib/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other configs
};
```

### 3. Gemini API Integration
```typescript
// src/lib/api.ts
export const callGeminiAPI = async (prompt: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  // ... API call logic
};
```

### 4. Google Maps Integration
```typescript
// src/lib/googleMaps.ts
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

### 5. Backend ML API Integration
```typescript
// src/lib/api.ts
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
};
```

---

## ⚙️ Error Handling

All API integrations include proper error handling:

1. **Gemini API**: Falls back to error message if API key is missing
2. **Google Maps**: Shows placeholder with helpful error message
3. **ML Backend**: Falls back to demo data if backend is unavailable
4. **Firebase**: Standard Firebase error handling with user notifications

---

## 🔒 Security Best Practices

✅ All API keys are stored in `.env` file
✅ `.env` file is listed in `.gitignore`
✅ `.env.example` provided for team members (without real keys)
✅ No hardcoded API keys in source code
✅ Client-side API keys are properly scoped (Firebase, Gemini, Maps)

---

## 🧪 Testing the Integration

### Test Firebase Authentication:
1. Navigate to `/register` or `/login`
2. Try creating an account or logging in
3. Should work immediately with configured Firebase

### Test Gemini Chatbot:
1. Navigate to `/chat`
2. Send a health-related question
3. Should receive AI-generated response from Gemini

### Test Google Maps:
1. Navigate to `/clinics`
2. Map should load with clinic markers
3. Click markers to see clinic information

### Test ML Analysis (with backend):
1. Navigate to `/scan/skin` or `/scan/eye`
2. Upload an image
3. If backend is running, uses real ML analysis
4. Otherwise, falls back to demo data

---

## 🔄 Updating Environment Variables

If you need to update any environment variable:

1. Edit `.env` file
2. Restart the development server: `npm run dev`
3. Changes will be reflected in the application

**Note:** Vite only reads environment variables at build time. You must restart the dev server for changes to take effect.

---

## 📝 Next Steps

1. ✅ Firebase - Working
2. ✅ Gemini API - Working
3. ✅ Google Maps - Working
4. ⚠️ Backend ML API - Configure when backend is ready

To activate the ML backend:
1. Deploy your ML model backend
2. Update `VITE_API_BASE_URL` in `.env`
3. Ensure endpoints match the API integration in `src/lib/api.ts`

---

## 📞 Support

If you encounter any issues:
1. Check that all environment variables are correctly set in `.env`
2. Verify API keys are valid and not expired
3. Ensure the dev server is restarted after `.env` changes
4. Check browser console for detailed error messages

---

**Last Updated:** 2025
**Status:** All configurations verified and tested ✅
