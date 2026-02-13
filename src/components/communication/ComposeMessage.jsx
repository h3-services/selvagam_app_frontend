import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faCommentDots, faUser, faSpinner, faUsers, faChevronDown, faBroadcastTower, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
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
                const response = await parentService.getAllParentFcmTokens();
                const data = response.parents || [];
                
                const mappedParents = data.map(p => ({
                    id: p.parent_id,
                    fcm: p.fcm_token,
                    status: p.parents_active_status,
                    name: p.name || 'Unknown Parent'
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
        if (!title.trim() || !messageText.trim()) return;
        setIsSending(true);

        try {
            if (selectedParentId === 'all') {
                const activeParents = parents.filter(p => p.status === 'ACTIVE' && p.fcm);
                if (activeParents.length === 0) throw new Error('No active parents found');

                await Promise.all(activeParents.map(parent => 
                    sendNotification(title.trim(), messageText.trim(), 'parent', messageType, parent.fcm)
                ));
            } else {
                const targetTokens = parents
                    .filter(p => p.id === selectedParentId && p.fcm)
                    .map(p => p.fcm);

                if (targetTokens.length === 0) throw new Error('No valid tokens found');

                await Promise.all(targetTokens.map(token => 
                    sendNotification(title.trim(), messageText.trim(), 'parent', messageType, token)
                ));
            }
            
            setTitle('');
            setMessageText('');
        } catch (error) {
            console.error('Send notification error:', error);
        } finally {
            setIsSending(false);
        }
    };

    const uniqueParents = parents.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-gray-100 px-8 py-6">
                <h2 className="text-xl font-bold text-gray-900 leading-none">Compose Notification</h2>
                <p className="text-sm text-gray-500 mt-2">Create and broadcast push alerts to parent devices</p>
            </div>

            <form onSubmit={handleSendMessage} className="p-8 lg:p-10 flex flex-col gap-8">
                {/* Configuration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recipient Selector */}
                    <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Target Audience</label>
                        <div className="relative group">
                            <select
                                value={selectedParentId}
                                onChange={(e) => setSelectedParentId(e.target.value)}
                                className="w-full pl-5 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-slate-50/50 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">Broadcast to All Parents</option>
                                <optgroup label="Direct Message">
                                    {uniqueParents.map(parent => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name} ({parent.status})
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
                        </div>
                    </div>

                    {/* Message Type Selector */}
                    <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Delivery Mechanism</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-fit">
                            <button
                                type="button"
                                onClick={() => setMessageType('text')}
                                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2.5 ${messageType === 'text' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FontAwesomeIcon icon={faCommentDots} className="text-xs" /> Text Notification
                            </button>
                            <button
                                type="button"
                                onClick={() => setMessageType('audio')}
                                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2.5 ${messageType === 'audio' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FontAwesomeIcon icon={faMicrophone} className="text-xs" /> Voice Message
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-6 pt-4 border-t border-slate-50">
                    <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Message Heading</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a brief, catchy title..."
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-slate-50/50 text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Detailed Payload</label>
                        <div className="relative">
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={messageType === 'text' ? "Write your announcement details here..." : "Describe the voice message content..."}
                                className="w-full min-h-[180px] p-6 rounded-2xl border border-gray-200 bg-slate-50/50 text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all resize-none shadow-sm custom-scrollbar"
                                required
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
                                {messageText.length} Characters
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-6 mt-2 border-t border-slate-50">
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Network Secure</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSending || !title.trim() || !messageText.trim() || parents.length === 0}
                        className={`px-10 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center gap-3 transform active:scale-95 ${isSending || !title.trim() || !messageText.trim() || parents.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                    >
                        {isSending ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                                Sending Notification...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                                Broadcast Now
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComposeMessage;
