# 🔥 Firebase Notification Setup Guide

## 📋 Prerequisites
1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project created (already done: our-area-b5901)

## 🚀 Deployment Steps

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase (if not done)
```bash
firebase init
# Select: Functions, Hosting
# Use existing project: our-area-b5901
```

### 3. Deploy Cloud Function
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 4. Update Function URL
After deployment, update the URL in `src/services/notificationService.js` with your actual function URL.

## 📱 Mobile App Integration

### Flutter App Setup
Add to `pubspec.yaml`:
```yaml
dependencies:
  firebase_messaging: ^14.7.10
```

### Subscribe to Topics
```dart
// In your Flutter app
FirebaseMessaging.instance.subscribeToTopic("drivers");
FirebaseMessaging.instance.subscribeToTopic("parents");
```

### Handle Notifications
```dart
FirebaseMessaging.onMessage.listen((RemoteMessage message) {
  print('Title: ${message.notification?.title}');
  print('Body: ${message.notification?.body}');
  // Show notification to user
});
```

## ✅ Testing
1. Deploy the function
2. Open admin portal
3. Go to Communication page
4. Enter title and message
5. Select recipient (drivers/parents)
6. Click "Send Notification"
7. Check mobile app for notification

## 🔧 Troubleshooting
- Ensure Firebase project has Cloud Messaging enabled
- Check function logs: `firebase functions:log`
- Verify mobile app is subscribed to correct topics