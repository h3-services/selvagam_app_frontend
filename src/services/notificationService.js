// Remote backend URL for notifications - targeting the production API v1
const NOTIFICATION_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://api.selvagam.com/api/v1').replace(/\/$/, '');
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'selvagam-admin-key-2024';

/**
 * Specifically broadcasts a notification to ALL parents.
 * API Endpoint: /api/v1/notifications/broadcast/parents
 */
export const broadcastToParents = async (title, body, messageType = 'text') => {
  try {
    console.log('📢 Broadcasting to Parents:', { title, body, messageType });
    
    const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/broadcast/parents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
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

/**
 * Sends a notification to everyone on a specific route.
 * API Endpoint: /api/v1/notifications/route/{route_id}
 */
export const sendRouteNotification = async (routeId, title, body, messageType = 'text') => {
  try {
    console.log(`🚀 Sending Notification to Route #${routeId}:`, { title, body, messageType });
    
    const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/route/${routeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        message_type: messageType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error(`❌ Route Notification Error for Route #${routeId}:`, error);
    throw error;
  }
};

/**
 * Sends a notification to everyone in a specific class.
 * API Endpoint: /api/v1/notifications/class/{class_id}
 */
export const sendClassNotification = async (classId, title, body, messageType = 'text') => {
  try {
    console.log(`🚀 Sending Notification to Class #${classId}:`, { title, body, messageType });
    
    const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/class/${classId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        message_type: messageType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error(`❌ Class Notification Error for Class #${classId}:`, error);
    throw error;
  }
};

/**
 * Sends a direct notification to a specific device using its FCM token.
 */
export const sendNotification = async (title, body, recipientType, messageType, fcmToken) => {
  try {
    console.log('📱 Sending Direct FCM notification:', { title, body, messageType, token: fcmToken?.substring(0, 20) + '...' });
    
    const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/send-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_API_KEY
      },
      body: JSON.stringify({
        title,
        body,
        token: fcmToken,
        message_type: messageType,
        recipient_type: recipientType
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
 * Sends a broadcast notification to a specific topic (Generic fallback).
 */
export const sendBroadcastNotification = async (title, body, topic, messageType = 'text') => {
  try {
    console.log('📡 Broadcasting FCM notification:', { title, body, topic, messageType });
    
    const response = await fetch(`${NOTIFICATION_BASE_URL}/notifications/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_API_KEY
      },
      body: JSON.stringify({
        title,
        body,
        topic,
        message_type: messageType
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