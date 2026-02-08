import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faCommentDots, faUser, faSpinner, faUsers } from '@fortawesome/free-solid-svg-icons';
import { sendNotification } from '../../services/notificationService';
import { parentService } from '../../services/parentService';

const ComposeMessage = () => {
    const [parents, setParents] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState('all');
    const [messageType, setMessageType] = useState('text'); // 'text' | 'audio'
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [title, setTitle] = useState('');
    const [loadingParents, setLoadingParents] = useState(true);

    useEffect(() => {
        const fetchParentTokens = async () => {
            try {
                const data = await parentService.getAllParentFcmTokens();
                // Take only id, fcm, status as requested
                const mappedParents = data.map(p => ({
                    id: p.parent_id,
                    fcm: p.fcm_token,
                    status: p.parents_active_status,
                    name: p.name // Keeping name for the dropdown label
                }));
                setParents(mappedParents);
            } catch (error) {
                console.error("Failed to fetch parent tokens:", error);
            } finally {
                setLoadingParents(false);
            }
        };
        fetchParentTokens();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!title.trim() || !messageText.trim()) {
            console.error('Please fill in required fields');
            return;
        }

        setIsSending(true);

        try {
            if (selectedParentId === 'all') {
                // Broadcast to all ACTIVE parents
                const activeParents = parents.filter(p => p.status === 'ACTIVE' && p.fcm);
                
                if (activeParents.length === 0) {
                    throw new Error('No active parents with valid tokens found');
                }

                // Send notifications in parallel
                await Promise.all(activeParents.map(parent => 
                    sendNotification(title.trim(), messageText.trim(), 'parent', messageType, parent.fcm)
                ));
            } else {
                // Send to specific parent
                const targetParent = parents.find(p => p.id === selectedParentId);
                if (!targetParent || !targetParent.fcm) {
                    throw new Error('Selected parent does not have a valid token');
                }
                await sendNotification(title.trim(), messageText.trim(), 'parent', messageType, targetParent.fcm);
            }
            
            setTitle('');
            setMessageText('');
        } catch (error) {
            console.error('Send notification error:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col overflow-y-auto">
            <h2 className="font-bold text-gray-800 text-lg mb-6">Compose New Message</h2>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-6 h-full">

                {/* 1. Message Type */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">1. Message Type</label>
                    <div className="flex bg-gray-50 p-1.5 rounded-xl w-fit">
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
                </div>

                {/* 2. Message Title */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">2. Message Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter notification title..."
                        className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 bg-gray-50/50 transition-shadow"
                        required
                    />
                </div>

                {/* 3. Message Content */}
                <div className="flex-1 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">3. Message Content</label>
                    <div className="flex-1 min-h-[200px]">
                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder={messageType === 'text' ? "Write your message to all parents here..." : "Write your voice message to all parents here..."}
                            className="w-full h-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 resize-none bg-gray-50/50 transition-shadow"
                        ></textarea>
                    </div>
                </div>

                {/* Send Button */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={isSending || !title.trim() || !messageText.trim() || parents.length === 0}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all text-sm flex items-center gap-2 transform active:scale-95 ${isSending || !title.trim() || !messageText.trim() || parents.length === 0
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
    );
};

export default ComposeMessage;
