export const sendNotification = async (title, body, recipientType, messageType, fcmToken) => {
  try {
    console.log('📱 Sending notification via local backend:', {
      title,
      body,
      recipientType,
      messageType,
      token: fcmToken?.substring(0, 20) + '...'
    });

    const response = await fetch('http://localhost:3001/api/send-notification-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        recipientType,
        messageType,
        token: fcmToken
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to send notification');
    }

    const result = await response.json();
    console.log('✅ Backend Response:', result);

    return result;

  } catch (error) {
    console.error('❌ Notification Error:', error);
    throw error;
  }
};