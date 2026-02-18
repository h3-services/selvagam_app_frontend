import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faTimes, 
    faCheck, 
    faEdit, 
    faEnvelope, 
    faPhone, 
    faIdCard, 
    faCalendarAlt, 
    faPassport, 
    faShieldHalved, 
    faClock, 
    faToggleOn, 
    faToggleOff, 
    faLink, 
    faFingerprint,
    faBriefcase,
    faUserCircle,
    faCogs,
    faHistory,
    faUserSlash,
    faGraduationCap,
    faChevronDown,
    faCircle,
    faBan
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const DriverDetail = ({ selectedDriver, onBack, onUpdate, onDelete, onEdit, onStatusChange }) => {
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    
    if (!selectedDriver) return null;

    const statuses = [
        { label: 'Active', value: 'ACTIVE', icon: faCheck, color: 'emerald' },
        { label: 'Inactive', value: 'INACTIVE', icon: faCircle, color: 'amber' },
        { label: 'Resigned', value: 'RESIGNED', icon: faBan, color: 'rose' }
    ];

    const currentStatus = statuses.find(s => s.value === (selectedDriver.status || 'ACTIVE')?.toUpperCase()) || statuses[1];

    const SectionHeader = ({ icon, title, subtitle, color = "slate" }) => (
        <div className="flex items-center gap-5 mb-10">
            <div className={`w-14 h-14 rounded-[1.25rem] bg-white border border-slate-100 flex items-center justify-center text-${color}-600 shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500`}>
                <FontAwesomeIcon icon={icon} className="text-lg" />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">{subtitle}</p>
            </div>
        </div>
    );

    const InsightCard = ({ label, value, icon, color = "blue" }) => (
        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group/card hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-${color}-500 shadow-sm group-hover/card:scale-110 group-hover/card:bg-${color}-600 group-hover/card:text-white transition-all`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                    <p className="text-sm font-black text-slate-900 tracking-tight capitalize">{value || 'N/A'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Enterprise Header Bar */}
            <div className="bg-white border-b border-slate-200 px-10 h-24 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={onBack}
                        className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95 border border-transparent hover:border-slate-100"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-slate-300 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            {selectedDriver.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-slate-900 leading-none tracking-tight">{selectedDriver.name}</h2>
                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                                    selectedDriver.status === 'Active' || selectedDriver.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {selectedDriver.status || 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Management Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                            className={`px-6 py-3.5 rounded-2xl border ${
                                currentStatus.value === 'ACTIVE' 
                                ? 'border-emerald-100 text-emerald-600 bg-emerald-50/30' 
                                : currentStatus.value === 'RESIGNED'
                                ? 'border-rose-100 text-rose-500 bg-rose-50/30'
                                : 'border-amber-100 text-amber-600 bg-amber-50/30'
                            } text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95 shadow-sm hover:shadow-md`}
                        >
                            <FontAwesomeIcon icon={currentStatus.icon} className="text-[10px]" />
                            {currentStatus.label}
                            <FontAwesomeIcon icon={faChevronDown} className={`ml-1 text-[10px] transition-transform duration-300 ${showStatusMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showStatusMenu && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowStatusMenu(false)} />
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 mb-2 border-b border-slate-50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update Registry Status</p>
                                    </div>
                                    {statuses.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => {
                                                onStatusChange(selectedDriver.driver_id, status.value);
                                                setShowStatusMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all hover:bg-slate-50 ${
                                                selectedDriver.status?.toUpperCase() === status.value 
                                                ? `text-${status.color}-600 bg-${status.color}-50/50` 
                                                : 'text-slate-600'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                                                selectedDriver.status?.toUpperCase() === status.value 
                                                ? `bg-white border-${status.color}-100 text-${status.color}-600` 
                                                : 'bg-white border-slate-100 text-slate-400'
                                            }`}>
                                                <FontAwesomeIcon icon={status.icon} className="text-[10px]" />
                                            </div>
                                            {status.label}
                                            {selectedDriver.status?.toUpperCase() === status.value && (
                                                <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-${status.color}-500 shadow-sm`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button 
                        onClick={() => onEdit(selectedDriver)}
                        className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95 group"
                    >
                        <FontAwesomeIcon icon={faEdit} className="group-hover:rotate-12 transition-transform" />
                        Modify Profile
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-12">
                    
                    {/* Left Column - Core Identity */}
                    <div className="col-span-12 lg:col-span-5 space-y-10">
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                            <SectionHeader icon={faIdCard} title="Personnel Dossier" color="blue" />
                            
                            <div className="space-y-6">
                                <InsightCard label="Primary Contact" value={selectedDriver.phone || selectedDriver.mobile} icon={faPhone} color="blue" />
                                <InsightCard label="Official Email" value={selectedDriver.email} icon={faEnvelope} color="indigo" />
                                
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Operational Credentials & Timeline */}
                    <div className="col-span-12 lg:col-span-7 space-y-10">
                        {/* Operational Card */}
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm group">
                            <SectionHeader icon={faCheck} title="License Information" color="emerald" />
                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 transition-all duration-500">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">License Number</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight">{selectedDriver.licence_number || selectedDriver.licenseNumber || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:border-amber-200 transition-all duration-500">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">License Expiry</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                        </div>
                                        <p className="text-lg font-black text-slate-900 tracking-tight">{selectedDriver.licence_expiry || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default DriverDetail;
