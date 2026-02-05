import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faPhone, faEnvelope, faMapMarkerAlt, faInfoCircle, faCalendarAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const ParentViewDrawer = ({ show, onClose, parentData }) => {
    if (!show || !parentData) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[3000]" onClick={onClose}></div>

            {/* Side Drawer */}
            <div className="fixed right-0 top-0 h-screen w-full sm:w-[500px] bg-white shadow-2xl z-[3001] flex flex-col p-0 transition-transform duration-300 animate-slide-in overflow-hidden rounded-l-[40px]">
                {/* Header */}
                <div className="relative p-8 text-white min-h-[180px] flex flex-col justify-end" style={{ backgroundColor: '#40189d' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition text-white"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    
                    <div className="flex items-center gap-6 relative">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                            {parentData.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold leading-tight">{parentData.name}</h2>
                            <div className="flex items-center gap-2 mt-1 opacity-90">
                                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                                    {parentData.parent_role || 'Parent'}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${parentData.parents_active_status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                <span className="text-xs font-medium">{parentData.parents_active_status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
                    {/* Primary Contact Section */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[2px] mb-4">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-purple-200 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</span>
                                    <span className="text-base font-bold text-gray-800">{parentData.phone || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-purple-200 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div className="flex (lex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</span>
                                    <span className="text-base font-bold text-gray-800 break-all">{parentData.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[2px] mb-4">Residential Address</h4>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mt-1 shrink-0">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Full Address</p>
                                    <p className="text-gray-800 font-bold leading-relaxed">
                                        {parentData.door_no}, {parentData.street}<br />
                                        {parentData.city}, {parentData.district}<br />
                                        {parentData.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-400 text-sm" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Joined On</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800">
                                {parentData.created_at ? new Date(parentData.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-purple-400 text-sm" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Parent ID</span>
                            </div>
                            <p className="text-[10px] font-mono font-bold text-gray-800 break-all uppercase">
                                {parentData.parent_id?.substring(0, 13)}...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-white border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
            
            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
};

export default ParentViewDrawer;
