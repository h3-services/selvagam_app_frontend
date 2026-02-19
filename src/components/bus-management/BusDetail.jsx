import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, faCheck, faEdit, faArrowLeft, faBus, faUser, 
    faIndustry, faCogs, faCalendarCheck, faIdCard, 
    faShieldAlt, faRoute, faChair, faBuilding,
    faFingerprint, faCircleCheck, faArrowUpRightFromSquare,
    faMapMarkerAlt, faPhone, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const BusDetail = ({ selectedBus, drivers, onBack, onEdit }) => {
    if (!selectedBus) return null;

    const SectionHeader = ({ icon, title, subtitle }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>
            </div>
        </div>
    );

    const DataRow = ({ label, value, isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''} space-y-1.5`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F1F5F9] overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            {/* Header Bar */}
            <div className="bg-white border-b border-slate-200 px-8 h-20 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">
                            <FontAwesomeIcon icon={faBus} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 leading-none">{selectedBus.bus_name || selectedBus.busNumber}</h2>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                    (selectedBus.status || '').toUpperCase() === 'ACTIVE' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {selectedBus.status}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1.5 focus-within:">
                                <span className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Reg. No:</span> <span className="text-slate-900 font-bold">{selectedBus.registration_number || selectedBus.busNumber}</span> • <span className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Type:</span> <span className="text-indigo-600 font-black">{selectedBus.vehicle_type || 'Standard'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onEdit(selectedBus)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-xs" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
                    
                    {/* Sidebar (Left) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Technical Specifications */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faFingerprint} title="Bus Details" />
                            <div className="space-y-6 pt-2">

                                <div className="grid grid-cols-2 gap-4">
                                    <DataRow label="Bus Name" value={selectedBus.bus_name} />
                                    <DataRow label="Reg. No" value={selectedBus.registration_number} />
                                    <DataRow label="Make / Brand" value={selectedBus.bus_brand} />
                                    <DataRow label="Model" value={selectedBus.bus_model} />
                                    <DataRow label="Seats" value={`${selectedBus.seating_capacity || selectedBus.capacity} Seats`} />
                                    <DataRow label="Category" value={selectedBus.vehicle_type} />
                                </div>
                            </div>
                        </div>

                        {/* Driver Assignment Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faUser} title="Driver Info" />
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold">
                                            {selectedBus.driverName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{selectedBus.driverName || 'No Driver Assigned'}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Assigned Driver</p>
                                        </div>
                                    </div>
                                    {selectedBus.driver_id && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">
                                                    {drivers.find(d => d.driver_id === selectedBus.driver_id)?.phone || 'N/A'}
                                                </p>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Phone</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                        </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Legal & Compliance Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <SectionHeader icon={faShieldAlt} title="Documents" />
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* RC Book Details */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                            <FontAwesomeIcon icon={faIdCard} className="text-indigo-500 text-xs" />
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Registration (RC)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <DataRow label="Expiry Date" value={selectedBus.rc_expiry_date} />
                                            <div className="group relative rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-indigo-200 transition-all bg-slate-50 h-[200px]">
                                                {selectedBus.rc_book_url ? (
                                                    <img src={selectedBus.rc_book_url} alt="RC Book" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                        <FontAwesomeIcon icon={faIdCard} className="text-4xl mb-2 opacity-20" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">No RC Document</span>
                                                    </div>
                                                )}
                                            </div>
                                            </div>
                                        </div>

                                    {/* FC Details */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                            <FontAwesomeIcon icon={faCalendarCheck} className="text-rose-500 text-xs" />
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Fitness (FC)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <DataRow label="Expiry Date" value={selectedBus.fc_expiry_date} />
                                            <div className="group relative rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-rose-200 transition-all bg-slate-50 h-[200px]">
                                                {selectedBus.fc_certificate_url ? (
                                                    <img src={selectedBus.fc_certificate_url} alt="FC Certificate" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                        <FontAwesomeIcon icon={faCalendarCheck} className="text-4xl mb-2 opacity-20" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">No FC Document</span>
                                                    </div>
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>

                        {/* Logistics Summary */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faRoute} title="Route Info" />
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500">
                                        <FontAwesomeIcon icon={faRoute} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Active Route</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedBus.route || 'Not Assigned'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                    <p className="text-xs font-bold text-slate-900">In Use</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 0px; }`}</style>
        </div>
    );
};

export default BusDetail;
