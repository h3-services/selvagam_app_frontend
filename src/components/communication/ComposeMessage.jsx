import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faMicrophone, 
    faCommentDots, 
    faUser, 
    faSpinner, 
    faUsers, 
    faChevronDown, 
    faBroadcastTower, 
    faShieldHalved,
    faRoute,
    faTruck
} from '@fortawesome/free-solid-svg-icons';
import { sendNotification, sendBroadcastNotification, broadcastToParents } from '../../services/notificationService';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const ComposeMessage = ({ targetCategory, targetId, targetLabel }) => {
    const [parents, setParents] = useState([]);
    const [messageType, setMessageType] = useState('text'); // 'text' | 'audio'
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [title, setTitle] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const parentRes = await parentService.getAllParentFcmTokens();
                const parentData = parentRes.parents || [];
                const mappedParents = parentData.map(p => ({
                    id: p.parent_id,
                    fcm: p.fcm_token,
                    status: p.parents_active_status,
                    name: p.name || 'Unknown Parent'
                }));
                setParents(mappedParents);
            } catch (error) {
                console.error("Failed to fetch communication data:", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!title.trim() || !messageText.trim()) return;
        
        // Validation for selection
        if (targetCategory !== 'ALL' && !targetId) {
            alert(`⚠️ Selection Required: Please choose a ${targetCategory.toLowerCase()} from the selector above.`);
            return;
        }

        setIsSending(true);

        try {
            if (targetCategory === 'ALL') {
                // Specialized broadcast for all parents using specific API endpoint
                await broadcastToParents(
                    title.trim(), 
                    messageText.trim(), 
                    messageType
                );
            } else if (targetCategory === 'ROUTE') {
                // Broadcast to a route-specific topic (e.g., 'route_1_users')
                const topic = `route_${targetId}_users`;
                await sendBroadcastNotification(
                    title.trim(), 
                    messageText.trim(), 
                    topic, 
                    messageType
                );
            } else if (targetCategory === 'CLASS') {
                // Broadcast to a class-specific topic (e.g., 'class_1_users')
                const topic = `class_${targetId}_users`;
                await sendBroadcastNotification(
                    title.trim(), 
                    messageText.trim(), 
                    topic, 
                    messageType
                );
            }
            
            // Notification dispatched successfully
            setTitle('');
            setMessageText('');
            alert('🚀 Message dispatched successfully!');
        } catch (error) {
            console.error('Dispatch error:', error);
            alert(`⚠️ Delivery Failed: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    const uniqueParents = parents.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);

    const getTargetIcon = () => {
        if (selectedTarget.includes('all_users')) return faUsers;
        if (selectedTarget.includes('drivers')) return faTruck;
        if (selectedTarget.includes('route')) return faRoute;
        return faUser;
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col animate-fade-in">
            <form onSubmit={handleSendMessage} className="p-10 lg:p-12 flex flex-col gap-10">
                {/* Mechanism Section */}
                <div className="flex flex-col gap-3 max-w-md">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400" />
                        Message Format
                    </label>
                    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setMessageType('text')}
                            className={`flex-1 px-8 py-3 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2.5 tracking-wider ${messageType === 'text' ? 'bg-white text-blue-600 shadow-md border border-slate-100 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <FontAwesomeIcon icon={faCommentDots} /> TEXT ALERT
                        </button>
                        <button
                            type="button"
                            onClick={() => setMessageType('audio')}
                            className={`flex-1 px-8 py-3 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2.5 tracking-wider ${messageType === 'audio' ? 'bg-white text-blue-600 shadow-md border border-slate-100 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <FontAwesomeIcon icon={faMicrophone} /> VOICE NOTE
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-8 animate-slide-up">
                    <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Notification Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Weather Alert - Route Delay"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Message Content</label>
                        <div className="relative group">
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={messageType === 'text' ? "Compose your critical announcement..." : "Describe the voice message contents..."}
                                className="w-full min-h-[160px] p-8 rounded-3xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-indigo-400 focus:bg-white transition-all resize-none shadow-sm custom-scrollbar leading-relaxed"
                                required
                            ></textarea>
                            <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${messageText.length > 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`}></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{messageText.length} Chars</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-100">

                    <button
                        type="submit"
                        disabled={isSending || !title.trim() || !messageText.trim() || loadingData}
                        className={`group relative overflow-hidden px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl ${
                            isSending || !title.trim() || !messageText.trim() || loadingData
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                            : 'bg-blue-600 text-white hover:bg-slate-900 hover:shadow-indigo-200 hover:-translate-y-1'
                        }`}
                    >
                        {isSending ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Dispatching...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Transmit Now
                            </>
                        )}
                        {/* Interactive Shine Effect */}
                        {!isSending && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none skew-x-[-20deg]"></div>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComposeMessage;
