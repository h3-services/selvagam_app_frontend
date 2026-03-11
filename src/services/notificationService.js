import api from './api';

/**
 * Specifically broadcasts a notification to ALL parents.
 */
export const broadcastToParents = async (title, body, messageType = 'text') => {
  try {
    console.log('📢 Broadcasting to Parents:', { title, body, messageType });
    const response = await api.post('/notifications/broadcast/parents', {
      title: title.trim(),
      body: body.trim(),
      message_type: messageType
    });
    return response.data;
  } catch (error) {
    console.error('❌ Broadcast to Parents Error:', error);
    throw error;
  }
};

/**
 * Sends a notification to everyone on a specific route.
 */
export const sendRouteNotification = async (routeId, title, body, messageType = 'text') => {
  try {
    console.log(`🚀 Sending Notification to Route #${routeId}:`, { title, body, messageType });
    const response = await api.post(`/notifications/route/${routeId}`, {
      title: title.trim(),
      body: body.trim(),
      message_type: messageType
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Route Notification Error for Route #${routeId}:`, error);
    throw error;
  }
};

/**
 * Sends a notification to everyone in a specific class.
 */
export const sendClassNotification = async (classId, title, body, messageType = 'text') => {
  try {
    console.log(`🚀 Sending Notification to Class #${classId}:`, { title, body, messageType });
    const response = await api.post(`/notifications/class/${classId}`, {
      title: title.trim(),
      body: body.trim(),
      message_type: messageType
    });
    return response.data;
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
    const response = await api.post('/notifications/send-device', {
      title: title.trim(),
      body: body.trim(),
      token: fcmToken,
      message_type: messageType,
      recipient_type: recipientType
    });
    return response.data;
  } catch (error) {
    console.error('❌ Direct FCM Notification Error:', error);
    throw error;
  }
};

/**
 * Fetches notification history for a specific student.
 */
export const getStudentNotificationHistory = async (studentId) => {
  try {
    const response = await api.get(`/admin-parent-notifications/student/${studentId}`);
    return response.data || [];
  } catch (error) {
    console.error('❌ Student History Error:', error);
    return [];
  }
};

/**
 * Fetches notification history for a specific parent.
 */
export const getParentNotificationHistory = async (parentId) => {
  try {
    const response = await api.get(`/admin-parent-notifications/parent/${parentId}`);
    return response.data || [];
  } catch (error) {
    console.error('❌ Parent History Error:', error);
    return [];
  }
};

/**
 * Fetches FCM tokens for a specific location.
 */
export const getLocationFCMTokens = async (locationName) => {
  try {
    const response = await api.get(`/fcm-tokens/by-location/${encodeURIComponent(locationName)}`);
    return response.data || [];
  } catch (error) {
    console.error('❌ Location FCM Lookup Error:', error);
    return [];
  }
};

/**
 * Saves a notification record in the tracking history.
 */
export const saveAdminNotification = async (notificationData) => {
  try {
    // API safety: Remove student_id if it's null, empty or undefined
    // Backend likely expects a valid UUID or for the key to be missing
    const payload = { ...notificationData };
    if (!payload.student_id) {
        delete payload.student_id;
    }

    const response = await api.post('/admin-parent-notifications', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Save Admin Notification Error:', error);
    throw error;
  }
};

/**
 * Sends a notification to everyone at a specific location.
 */
export const sendLocationNotification = async (locationName, title, body, messageType = 'text', adminId) => {
  try {
    // 1. Get tokens for this location
    const tokens = await getLocationFCMTokens(locationName);
    
    if (!tokens || tokens.length === 0) {
      throw new Error("No recipients found for this location");
    }

    // 2. Save history record
    await saveAdminNotification({
      title,
      message: body,
      sent_by_admin_id: adminId
    });

    return { success: true, count: tokens.length };

  } catch (error) {
    console.error('❌ Location Notification Error:', error);
    throw error;
  }
};