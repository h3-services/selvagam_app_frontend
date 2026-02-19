import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faEdit, faCheck, faIdCard, faPhone, 
    faEnvelope, faMapMarkerAlt, faChild, faUserShield,
    faClock, faInfoCircle, faHistory, faGraduationCap,
    faVenusMars, faCalendarDay, faLocationDot, faCircleCheck,
    faLink, faUserSlash, faTrash, faChevronDown, faTimes, faSave, faUserTie, faHashtag,
    faArrowRight, faBus, faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { parentService } from '../../services/parentService';

const ParentDetail = ({ selectedParent, onBack, onUpdate, onDelete, onEdit, onLink }) => {
    if (!selectedParent) return null;

    const SectionHeader = ({ icon, title, subtitle }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div>
                <h3 className="text-base font-black text-slate-900 leading-none tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>
            </div>
        </div>
    );

    const DataRow = ({ label, value, isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''} space-y-1.5`}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-slate-700">{value || 'Not Provided'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Enterprise Header Bar */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 z-20">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-slate-200">
                            {selectedParent.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-none tracking-tight">{selectedParent.name}</h2>
                                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${
                                    selectedParent.parents_active_status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {selectedParent.parents_active_status || 'Inactive'}
                                </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 mt-1 sm:mt-1.5 uppercase tracking-widest leading-none">
                                ID: <span className="text-slate-900 font-black">#PAR-{selectedParent.parent_id?.substring(0, 6)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                        onClick={() => onDelete(selectedParent.parent_id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-rose-100 text-rose-500 text-[11px] sm:text-sm font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faUserSlash} className="text-[10px] sm:text-xs" />
                        Deactivate
                    </button>
                    <button 
                        onClick={() => onEdit(selectedParent)}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-slate-900 text-white text-[11px] sm:text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-[10px] sm:text-xs" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
                <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 sm:gap-8">
                    
                    {/* Left Column - Core Profile */}
                    <div className="col-span-12 md:col-span-12 lg:col-span-4 space-y-6 sm:space-y-8">
                        <div className="bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
                            <SectionHeader icon={faIdCard} title="Parent Profile" subtitle="Basic Details" />
                            <div className="space-y-6 pt-2">
                                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                            <p className="text-sm font-black text-slate-900 truncate">{selectedParent.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-black text-slate-900 truncate">{selectedParent.email || 'None Provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-2" />

                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <DataRow label="City" value={selectedParent.city} />
                                    <DataRow label="District" value={selectedParent.district} />
                                    <DataRow label="Pincode" value={selectedParent.pincode} />
                                    <DataRow label="Role" value={selectedParent.parent_role} />
                                    <div className="col-span-2">
                                        <DataRow label="Door No" value={selectedParent.door_no} />
                                    </div>
                                    <div className="col-span-2">
                                        <DataRow label="Street Address" value={selectedParent.street} isFullWidth />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Relations */}
                    <div className="col-span-12 md:col-span-12 lg:col-span-8 space-y-6 sm:space-y-8 pb-10">
                        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/50">
                                <SectionHeader icon={faLink} title="Linked Students" subtitle="Family Tree Management" />
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                    <button 
                                        onClick={onLink}
                                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} className="text-[10px]" />
                                        Add Family Link
                                    </button>
                                    <span className="bg-white border border-slate-200 text-slate-400 text-[10px] font-black px-3 py-2.5 rounded-xl uppercase tracking-widest whitespace-nowrap">
                                        {selectedParent.linkedStudents?.length || 0} Connected
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedParent.linkedStudents && selectedParent.linkedStudents.length > 0 ? (
                                        selectedParent.linkedStudents.map((student, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => { /* Navigate to student if needed */ }}
                                                className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                            <FontAwesomeIcon icon={faChild} className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                                {student.name}
                                                            </h4>
                                                            <div className="mt-2">
                                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                                                    {student.class}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm">
                                                            <FontAwesomeIcon icon={faCalendarDay} className="text-[11px]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Date of Birth</p>
                                                            <p className="text-[13px] font-bold text-slate-700">
                                                                {student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                                            <FontAwesomeIcon icon={faVenusMars} className="text-[11px]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Gender Alignment</p>
                                                            <p className="text-[13px] font-bold text-slate-700 uppercase">{student.gender}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
                                                            <FontAwesomeIcon icon={faGraduationCap} className="text-[11px]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Academic Session</p>
                                                            <p className="text-[13px] font-bold text-slate-700">{student.studyYear}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-slate-200 shadow-sm">
                                                <FontAwesomeIcon icon={faUserSlash} size="xl" />
                                            </div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">No Family Records</h4>
                                            <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-[220px]">This guardian profile is not currently prioritized for any student records.</p>
                                        </div>
                                    )}
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

export default ParentDetail;
