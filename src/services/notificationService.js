export const sendNotification = async (title, body, recipientType, messageType, fcmToken) => {
  try {
    console.log('📱 Sending REAL FCM notification:', { title, body, messageType, token: fcmToken?.substring(0, 20) + '...' });
    
    // Send to backend server that will handle FCM
    const response = await fetch('/api/send-notification-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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