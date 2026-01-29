// Backend server URL - hosted on Hostinger
const FCM_SERVER_URL = 'http://72.62.196.30:3001';
const ADMIN_API_KEY = 'selvagam-admin-key-2024';

export const sendNotification = async (title, body, recipientType, messageType, fcmToken) => {
  try {
    console.log('📱 Sending REAL FCM notification:', { title, body, messageType, token: fcmToken?.substring(0, 20) + '...' });
    
    // Send to hosted backend server that will handle FCM
    const response = await fetch(`${FCM_SERVER_URL}/api/send-notification-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_API_KEY
      },
      body: JSON.stringify({
        title,
        body,
        token: fcmToken,
        messageType,
        recipientType
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ REAL FCM notification sent:', result);
    return result;
    
  } catch (error) {
    console.error('❌ FCM Error:', error);
    throw error;
  }
};