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
import { sendNotification, sendBroadcastNotification } from '../../services/notificationService';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const ComposeMessage = () => {
    const [parents, setParents] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState('topic:all_users');
    const [messageType, setMessageType] = useState('text'); // 'text' | 'audio'
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [title, setTitle] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const [parentRes, routeRes] = await Promise.all([
                    parentService.getAllParentFcmTokens(),
                    routeService.getAllRoutes()
                ]);

                const parentData = parentRes.parents || [];
                const mappedParents = parentData.map(p => ({
                    id: p.parent_id,
                    fcm: p.fcm_token,
                    status: p.parents_active_status,
                    name: p.name || 'Unknown Parent'
                }));
                setParents(mappedParents);
                setRoutes(routeRes || []);
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
        setIsSending(true);

        try {
            if (selectedTarget.startsWith('topic:')) {
                // Broadcast to a specific topic
                const topic = selectedTarget.split(':')[1];
                await sendBroadcastNotification(
                    title.trim(), 
                    messageText.trim(), 
                    topic, 
                    messageType
                );
            } else if (selectedTarget.startsWith('route:')) {
                // Broadcast to a route-specific topic (e.g., 'route_1_users')
                const routeId = selectedTarget.split(':')[1];
                const topic = `route_${routeId}_users`;
                await sendBroadcastNotification(
                    title.trim(), 
                    messageText.trim(), 
                    topic, 
                    messageType
                );
            } else {
                // Individual Direct Message
                const targetTokens = parents
                    .filter(p => p.id === selectedTarget && p.fcm)
                    .map(p => p.fcm);

                if (targetTokens.length === 0) throw new Error('No valid mobile tokens found for this recipient');

                await Promise.all(targetTokens.map(token => 
                    sendNotification(title.trim(), messageText.trim(), 'parent', messageType, token)
                ));
            }
            
            alert("✨ Notification dispatched successfully!");
            setTitle('');
            setMessageText('');
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
            {/* Professional Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-10 py-8 relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 italic">H</span>
                            Communication Hub
                        </h2>
                        <p className="text-slate-500 font-medium text-sm mt-1.5 ml-1">Compose and broadcast secure push alerts across the network</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2.5">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-600 text-xs" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">TLS 1.3 Secure</span>
                        </div>
                    </div>
                </div>
                {/* Abstract Design Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>

            <form onSubmit={handleSendMessage} className="p-10 lg:p-12 flex flex-col gap-10">
                {/* Audience & Mechanism Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBroadcastTower} className="text-indigo-400" />
                            Target Audience
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                                <FontAwesomeIcon icon={getTargetIcon()} />
                            </div>
                            <select
                                value={selectedTarget}
                                onChange={(e) => setSelectedTarget(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                                disabled={loadingData}
                            >
                                <optgroup label="System Broadcasts">
                                    <option value="topic:all_users">📣 All Registered Users</option>
                                    <option value="topic:parents">👨‍👩‍👧‍👦 All Parents</option>
                                    <option value="topic:drivers">🚛 All Drivers</option>
                                </optgroup>
                                
                                {routes.length > 0 && (
                                    <optgroup label="Route Specific Channels">
                                        {routes.map(route => (
                                            <option key={route.id} value={`route:${route.id}`}>
                                                📍 {route.name || `Route ${route.id}`}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}

                                <optgroup label="Direct Message (Mobile Devices)">
                                    {uniqueParents.map(parent => (
                                        <option key={parent.id} value={parent.id}>
                                            👤 {parent.name} ({parent.status || 'Active'})
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            <FontAwesomeIcon icon={faChevronDown} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400" />
                            Message Format
                        </label>
                        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setMessageType('text')}
                                className={`flex-1 px-8 py-3 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2.5 tracking-wider ${messageType === 'text' ? 'bg-white text-indigo-600 shadow-md border border-slate-100 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <FontAwesomeIcon icon={faCommentDots} /> TEXT ALERT
                            </button>
                            <button
                                type="button"
                                onClick={() => setMessageType('audio')}
                                className={`flex-1 px-8 py-3 rounded-[0.9rem] text-xs font-black transition-all flex items-center justify-center gap-2.5 tracking-wider ${messageType === 'audio' ? 'bg-white text-indigo-600 shadow-md border border-slate-100 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <FontAwesomeIcon icon={faMicrophone} /> VOICE NOTE
                            </button>
                        </div>
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
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
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
                                className="w-full min-h-[160px] p-8 rounded-3xl border border-slate-200 bg-slate-50/50 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all resize-none shadow-sm custom-scrollbar leading-relaxed"
                                required
                            ></textarea>
                            <div className="absolute bottom-6 right-6 flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${messageText.length > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`}></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{messageText.length} Chars</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-4 px-6 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none mb-1">Encrypted Gateway</span>
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.1em]">Ready for transmission</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSending || !title.trim() || !messageText.trim() || loadingData}
                        className={`group relative overflow-hidden px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl ${
                            isSending || !title.trim() || !messageText.trim() || loadingData
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                            : 'bg-indigo-600 text-white hover:bg-slate-900 hover:shadow-indigo-200 hover:-translate-y-1'
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
