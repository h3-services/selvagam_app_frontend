// Remote backend URL for FCM notifications from environment variables
const FCM_SERVER_URL = import.meta.env.VITE_FCM_SERVER_URL || 'https://api.selvagam.com';
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'selvagam-admin-key-2024';

/**
 * Sends a direct notification to a specific device using its FCM token.
 */
export const sendNotification = async (title, body, recipientType, messageType, fcmToken) => {
  try {
    console.log('📱 Sending Direct FCM notification:', { title, body, messageType, token: fcmToken?.substring(0, 20) + '...' });
    
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
    console.log('✅ Direct FCM notification sent:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Direct FCM Error:', error);
    throw error;
  }
};

/**
 * Sends a broadcast notification to a specific topic (e.g., 'parents', 'drivers', 'all_users').
 */
export const sendBroadcastNotification = async (title, body, topic, messageType = 'text') => {
  try {
    console.log('📡 Broadcasting FCM notification:', { title, body, topic, messageType });
    
    const response = await fetch(`${FCM_SERVER_URL}/api/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_API_KEY
      },
      body: JSON.stringify({
        title,
        body,
        topic,
        messageType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Broadcast FCM notification sent:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Broadcast FCM Error:', error);
    throw error;
  }
};

/**
 * Specifically broadcasts a notification to ALL parents.
 * API Endpoint: /api/notifications/broadcast/parents
 */
export const broadcastToParents = async (title, body, messageType = 'text') => {
  try {
    console.log('📢 Broadcasting to Parents:', { title, body, messageType });
    
    const response = await fetch(`${FCM_SERVER_URL}/api/notifications/broadcast/parents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY
      },
      body: JSON.stringify({
        title,
        body,
        message_type: messageType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('❌ Broadcast to Parents Error:', error);
    throw error;
  }
};