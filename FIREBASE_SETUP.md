# Firebase Google Authentication Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "StudyBuddy-Auth")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Google Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Enable the Google provider
4. Add your project email for support
5. Click "Save"

## 3. Add Web App to Firebase

1. In Firebase project, go to **Project Settings** (⚙️ icon)
2. Click **"Add app"** → **Web**
3. Give your app a nickname (e.g., "StudyBuddy Web")
4. Click "Register app"
5. Copy the **Firebase configuration** object

## 4. Update Frontend Configuration

Edit `frontend/src/firebase/firebase.config.js` and replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Optional
};
```

## 5. Generate Service Account Key

1. In Firebase project, go to **Project Settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Select JSON as the key type
4. Click "Generate key"
5. Save the downloaded JSON file

## 6. Add Service Account to Backend

1. Rename the downloaded JSON file to `firebase-service-account.json`
2. Place it in `backend/src/config/firebase-service-account.json`
3. **IMPORTANT**: Add this file to your `.gitignore` to keep it secure!

## 7. Update Environment Variables (Optional)

Create or update `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 8. Restart Servers

```bash
# Stop current servers
# Ctrl+C in both frontend and backend terminals

# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev
```

## 9. Test Google Authentication

1. Go to http://localhost:5173/login or http://localhost:5173/register
2. Click "Continue with Google"
3. Select your Google account
4. You should be redirected to the dashboard after successful authentication

## Security Notes

- **NEVER** commit your service account key to version control
- Keep your Firebase API keys secure
- In production, use environment variables for sensitive data
- Regularly rotate your service account keys

## Troubleshooting

### Common Issues:

1. **"Invalid Firebase token" error**
   - Check that your service account key is correctly placed
   - Verify the Firebase project ID matches

2. **"CORS policy error"**
   - Ensure your backend CORS allows the frontend URL
   - Check that both servers are running

3. **"App not authorized" error**
   - Make sure Google Authentication is enabled in Firebase
   - Verify your domain is added to authorized domains in Firebase Auth settings

4. **"Service account not found" error**
   - Check that the service account JSON file is in the correct location
   - Verify the file is valid JSON and not corrupted

### Debug Steps:

1. Check browser console for frontend errors
2. Check backend terminal for authentication errors
3. Verify Firebase project settings
4. Test with a different Google account
5. Clear browser cache and try again

## Features Implemented

✅ Google Sign-In button on login/register pages  
✅ Firebase token verification on backend  
✅ Automatic user creation for new Google users  
✅ JWT token generation for app authentication  
✅ User profile sync with Google data  
✅ Secure logout from both Firebase and app  
✅ Error handling and user feedback  

Your StudyBuddy app now supports Google authentication alongside regular email/password authentication!
