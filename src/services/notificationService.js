const API_URL = 'http://localhost:3001/api/send-notification';
const ADMIN_KEY = 'selvagam-admin-key-2024';

export const sendNotification = async (title, body, recipientType, messageType) => {
  try {
    const topic = recipientType === 'driver' ? 'drivers' : 'parents';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ADMIN-KEY': ADMIN_KEY
      },
      body: JSON.stringify({
        title,
        body,
        topic,
        messageType
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};