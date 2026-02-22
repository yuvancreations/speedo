# Speedo - Premium Airport Transfer Service

A modern, fast, and responsive React application built for a premium airport pickup and drop service based in Haridwar, Uttarakhand.

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4, Framer Motion (Animations), Lucide React (Icons)
- **Routing:** React Router v6
- **Backend & Auth:** Firebase Auth (Email/Pass + OTP), Firebase Firestore
- **State Management:** React Context API

## Core Features
1. **Responsive Premium UI:** Glassmorphism, smooth scrolling, fast loading.
2. **Authentication System:** Secure email/password login + OTP phone authentication fallback.
3. **Role-Based Access:** Standard user dashboard and Administrator control panel.
4. **Booking System:** Dynamic fare calculation and location fetching.
5. **Admin Analytics:** Revenue insights, status filtering, and booking lifecycle management.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
You need to connect this app to your own Firebase project.

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password & Phone providers).
3. Enable **Firestore Database** and set rules (see below).
4. Create a `.env.local` file in the root directory and add your keys:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key_here"
   VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

### 3. Firestore Rules
Navigate to your Firestore Rules in the Firebase console and apply:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /bookings/{bookingId} {
      // User can read/write their own
      allow read, create: if request.auth != null;
      allow update, delete: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 4. Setting up an Admin Profile
To access the Admin panel, manually change a user's `role` field from `"user"` to `"admin"` directly within your Firestore Database in the Firebase Console.

### 5. Start Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```
The `/dist` folder can then be deployed to Firebase Hosting easily using `firebase deploy`.
