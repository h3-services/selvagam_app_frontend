import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faMicrophone, 
    faCommentDots, 
    faSpinner, 
    faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../config/firebase';
import { broadcastToParents, sendRouteNotification, sendClassNotification, sendLocationNotification } from '../../services/notificationService';

const ComposeMessage = ({ targetCategory, targetIds = [] }) => {
    const [messageType, setMessageType] = useState('text'); // 'text' | 'audio'
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [title, setTitle] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!title.trim() || !messageText.trim()) return;
        
        // Validation for selection
        if (targetCategory !== 'ALL' && targetIds.length === 0) {
            alert(`⚠️ Selection Required: Please choose at least one ${targetCategory.toLowerCase()} from the selector above.`);
            return;
        }

        setIsSending(true);

        try {
            if (targetCategory === 'ALL') {
                await broadcastToParents(title.trim(), messageText.trim(), messageType);
            } else if (targetCategory === 'ROUTE') {
                await Promise.all(targetIds.map(async (id) => {
                    await sendRouteNotification(id, title.trim(), messageText.trim(), messageType);
                }));
            } else if (targetCategory === 'CLASS') {
                await Promise.all(targetIds.map(async (id) => {
                    await sendClassNotification(id, title.trim(), messageText.trim(), messageType);
                }));
            } else if (targetCategory === 'LOCATION') {
                await Promise.all(targetIds.map(loc => 
                    sendLocationNotification(loc, title.trim(), messageText.trim(), messageType)
                ));
            }
            
            // Notification dispatched successfully
            setTitle('');
            setMessageText('');
        } catch (error) {
            console.error("Failed to send notification:", error);
            alert("❌ Failed to send notification. Please check console for details.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col animate-fade-in">
            {/* Context Header */}
            <div className="bg-indigo-600/5 px-8 py-6 flex items-center justify-between border-b border-indigo-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <FontAwesomeIcon icon={faCommentDots} className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-slate-900 text-lg font-black tracking-tight uppercase">Compose Announcement</h2>
                        <p className="text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase">Target: {targetCategory}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-indigo-100 shadow-sm">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400 text-xs" />
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Secure Matrix Sync</span>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSendMessage} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Announcement Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Urgent: School Bus Update / Weather Alert..."
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                            required
                        />
                    </div>

                    {/* Content Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Message Body</label>
                        <div className="relative group/textarea">
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your detailed message here..."
                                className="w-full h-40 px-6 py-5 bg-slate-50 rounded-[2rem] border-2 border-slate-100 text-sm font-bold text-slate-600 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none custom-scrollbar"
                                required
                            />
                            <div className="absolute bottom-4 right-6 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${messageText.length > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                                    {messageText.length} Characters
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Message Type Toggle */}
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Type</p>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm ml-auto">
                            <button 
                                type="button"
                                onClick={() => setMessageType('text')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${messageType === 'text' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600'}`}
                            >
                                Standard Text
                            </button>
                            <button 
                                type="button"
                                onClick={() => setMessageType('audio')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${messageType === 'audio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600'}`}
                            >
                                <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                                Voice Alert
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {isSending ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="text-blue-400" />
                                <span>Dispatching...</span>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-12 transition-all">
                                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                                </div>
                                <span>Broadcast Message</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
            
            {/* Footer Tip */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Sent notifications are permanently recorded in administrative logs.
                </p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Server Sync Active</span>
                </div>
            </div>
        </div>
    );
};

export default ComposeMessage;
