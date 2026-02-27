import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, faUser, faPhone, faEnvelope, faMapMarkerAlt, 
    faInfoCircle, faCalendarAlt, faShieldAlt, faArrowUpRightFromSquare,
    faUserTie, faFingerprint, faShieldHalved, faIdCard
} from '@fortawesome/free-solid-svg-icons';

const ParentViewDrawer = ({ show, onClose, parentData }) => {
    if (!show || !parentData) return null;

    const DataPill = ({ icon, label, value, colorClass = "bg-slate-50 text-slate-600" }) => (
        <div className={`p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all group/pill`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${colorClass} flex items-center justify-center group-hover/pill:scale-110 transition-transform`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                    <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{value || 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* 🌌 High-Performance Backdrop */}
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99999] animate-in fade-in duration-500" onClick={onClose}></div>

            {/* 🛸 Elite Sidebar Matrix */}
            <div className="fixed right-0 top-0 h-screen w-full sm:w-[550px] bg-[#FDFEFE] shadow-[0_0_100px_rgba(0,0,0,0.15)] z-[100000] flex flex-col p-0 transition-transform duration-500 animate-slide-in overflow-hidden rounded-l-[3.5rem] border-l border-white">
                
                {/* 🎨 Immersive Hero Header */}
                <div className="relative p-12 overflow-hidden bg-slate-900">
                    {/* Decorative Mesh */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-40 -mt-40"></div>
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500 rounded-full blur-[100px] opacity-10 -ml-30 -mb-30"></div>
                    
                    <div className="relative z-10 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-black text-white uppercase tracking-[0.3em]">
                                Parent Profile
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/20 border border-white/10 transition-all text-white group"
                            >
                                <FontAwesomeIcon icon={faTimes} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-400 to-blue-400 rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                                <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-4xl font-black text-slate-900 relative shadow-2xl transition-transform group-hover:scale-105">
                                    {parentData.name?.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-3">{parentData.name}</h2>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                        parentData.parents_active_status === 'ACTIVE' 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-rose-500 text-white'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        {parentData.parents_active_status}
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest">
                                        {(() => {
                                            const role = parentData.parent_role || parentData.role;
                                            if (!role) return 'PARENT';
                                            const roleUpper = role.toUpperCase();
                                            return roleUpper === 'GUARDIAN' ? 'PARENT' : roleUpper;
                                        })()}
                                    </div>
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                        System ID: #{parentData.parent_id?.substring(0, 8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🍱 Bento Core Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10 bg-gradient-to-b from-slate-50/50 to-white">
                    
                    {/* Access & Linkage Snapshot */}
                    <div className="grid grid-cols-2 gap-5">
                        <DataPill 
                            icon={faPhone} 
                            label="Primary Contact" 
                            value={parentData.phone} 
                            colorClass="bg-indigo-50 text-indigo-600"
                        />
                        <DataPill 
                            icon={faEnvelope} 
                            label="Digital Relay" 
                            value={parentData.email} 
                            colorClass="bg-blue-50 text-blue-600"
                        />
                    </div>

                    {/* Address Block */}
                    <div className="group">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400 text-sm" />
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Address</h4>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-6xl" />
                            </div>
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Residential Architecture</p>
                                    <p className="text-lg font-bold text-slate-900 leading-normal">
                                        {parentData.door_no}, {parentData.street}<br />
                                        <span className="text-slate-500">{parentData.city}, {parentData.district} - {parentData.pincode}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Audit Trail */}
                    <div className="grid grid-cols-2 gap-8 pt-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Node</p>
                            <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400" />
                                {parentData.created_at ? new Date(parentData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Security Footnote */}
                    <div className="p-6 rounded-2xl bg-slate-900 text-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faIdCard} className="text-xs opacity-50" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Profile ID</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-tighter opacity-80">{parentData.parent_id}</span>
                    </div>
                </div>

                {/* 🧱 Elite Action Base */}
                <div className="p-10 bg-white border-t border-slate-100 flex gap-4 mt-auto">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 rounded-[1.5rem] bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        Close Matrix
                    </button>
                    <button
                        className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group"
                    >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
};
export default ParentViewDrawer;
