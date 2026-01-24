import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faCommentDots, faUser, faUserTie, faVolumeUp, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { sendNotification } from '../services/notificationService';

const Communication = () => {
    const [recipientType, setRecipientType] = useState('driver'); // 'driver' | 'parent'
    const [messageType, setMessageType] = useState('text'); // 'text' | 'audio'
    const [messageText, setMessageText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [title, setTitle] = useState('');
    const [fcmToken, setFcmToken] = useState('');

    // Mock Recent Messages
    const recentMessages = [
        { id: 1, to: 'All Drivers', type: 'text', content: 'Urgent: Road closure on Route 5 due to maintenance.', time: '10 mins ago', recipient: 'Drivers' },
        { id: 2, to: 'All Parents', type: 'audio', content: 'Voice Message: School Annual Day Update', time: '1 hour ago', recipient: 'Parents' },
        { id: 3, to: 'All Parents', type: 'text', content: 'School will be closed tomorrow due to heavy rain.', time: 'Yesterday', recipient: 'Parents' },
    ];

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!title.trim() || !messageText.trim() || !fcmToken.trim()) {
            alert('Please fill in all fields');
            return;
        }

        setIsSending(true);

        try {
            // Clean the FCM token - remove any prefix like "FCM Token: "
            const cleanToken = fcmToken.trim().replace(/^FCM Token:\s*/i, '');
            
            await sendNotification(title.trim(), messageText.trim(), recipientType, messageType, cleanToken);
            alert(`✅ Notification sent successfully!`);
            setTitle('');
            setMessageText('');
            setFcmToken('');
            setIsRecording(false);
        } catch (error) {
            alert('❌ Failed to send notification. Please try again.');
            console.error('Send notification error:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-full p-6 lg:p-8 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 ml-20 lg:ml-0">Communication Hub</h1>
                <p className="text-gray-500 text-sm mt-1 ml-20 lg:ml-0">Send updates and messages to drivers and parents.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Left Column: Recent Messages History */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col overflow-hidden">
                    <h2 className="font-bold text-gray-800 text-lg mb-6">Recent Messages</h2>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {recentMessages.map((msg) => (
                            <div key={msg.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${msg.recipient === 'Drivers' || msg.recipient === 'Driver' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                                        {msg.recipient}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{msg.time}</span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 mb-1">{msg.to}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <FontAwesomeIcon icon={msg.type === 'audio' ? faVolumeUp : faAlignLeft} />
                                    <span className="truncate">{msg.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: New Message Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col overflow-y-auto">
                    <h2 className="font-bold text-gray-800 text-lg mb-6">Compose New Message</h2>

                    <form onSubmit={handleSendMessage} className="flex flex-col gap-6 h-full">

                        {/* 1. Select Recipient */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">1. Select Recipient Group</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRecipientType('driver')}
                                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${recipientType === 'driver' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${recipientType === 'driver' ? 'bg-purple-200' : 'bg-gray-100'}`}>
                                        <FontAwesomeIcon icon={faUserTie} className="text-lg" />
                                    </div>
                                    <span className="font-bold text-sm">All Drivers</span>
                                    {recipientType === 'driver' && <div className="absolute top-2 right-2 w-3 h-3 bg-purple-600 rounded-full ring-2 ring-white"></div>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRecipientType('parent')}
                                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${recipientType === 'parent' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${recipientType === 'parent' ? 'bg-pink-200' : 'bg-gray-100'}`}>
                                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                                    </div>
                                    <span className="font-bold text-sm">All Parents</span>
                                    {recipientType === 'parent' && <div className="absolute top-2 right-2 w-3 h-3 bg-pink-600 rounded-full ring-2 ring-white"></div>}
                                </button>
                            </div>
                        </div>

                        {/* 2. FCM Token */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">2. FCM Device Token</label>
                            <input
                                type="text"
                                value={fcmToken}
                                onChange={(e) => setFcmToken(e.target.value)}
                                placeholder="Enter FCM token for target device..."
                                className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 bg-gray-50/50 transition-shadow font-mono"
                                required
                            />
                        </div>

                        {/* 3. Message Title */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">3. Message Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter notification title..."
                                className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 bg-gray-50/50 transition-shadow"
                                required
                            />
                        </div>

                        {/* 4. Message Content */}
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">4. Message Content</label>

                            {/* Type Toggle */}
                            <div className="flex bg-gray-50 p-1.5 rounded-xl mb-4 w-fit">
                                <button
                                    type="button"
                                    onClick={() => setMessageType('text')}
                                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${messageType === 'text' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FontAwesomeIcon icon={faCommentDots} /> Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMessageType('audio')}
                                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${messageType === 'audio' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FontAwesomeIcon icon={faMicrophone} /> Audio
                                </button>
                            </div>

                            {/* Input Field */}
                            <div className="flex-1 min-h-[200px]">
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder={messageType === 'text' ? `Write your message to all ${recipientType}s here...` : `Write your voice message to all ${recipientType}s here...`}
                                    className="w-full h-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 resize-none bg-gray-50/50 transition-shadow"
                                ></textarea>
                            </div>
                        </div>

                        {/* Send Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSending || !title.trim() || !messageText.trim() || !fcmToken.trim()}
                                className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all text-sm flex items-center gap-2 transform active:scale-95 ${isSending || !title.trim() || !messageText.trim() || !fcmToken.trim()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                                    } text-white`}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className={isSending ? 'animate-pulse' : ''} />
                                {isSending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Communication;
