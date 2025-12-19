const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { title, body, recipientType } = req.body;

    if (!title || !body || !recipientType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const topic = recipientType === 'driver' ? 'drivers' : 'parents';

    const message = {
      topic: topic,
      notification: {
        title: title,
        body: body,
      },
      data: {
        type: recipientType,
        timestamp: Date.now().toString()
      }
    };

    const response = await admin.messaging().send(message);
    
    res.json({ 
      success: true, 
      messageId: response,
      topic: topic 
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});