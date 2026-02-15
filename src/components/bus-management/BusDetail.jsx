import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, faCheck, faEdit, faArrowLeft, faBus, faUser, 
    faIndustry, faCogs, faCalendarCheck, faIdCard, 
    faShieldAlt, faRoute, faChair, faBuilding,
    faFingerprint, faCircleCheck, faArrowUpRightFromSquare,
    faMapMarkerAlt, faPhone, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const BusDetail = ({ selectedBus, drivers, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (selectedBus) {
            setEditData({ ...selectedBus });
        }
    }, [selectedBus]);

    const handleSaveEdit = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

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

    const DataRow = ({ label, value, isEditing, field, type = "text", isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''} space-y-1.5`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            {isEditing ? (
                <input
                    type={type}
                    value={editData?.[field] || ''}
                    onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                    className="w-full px-2 py-1 text-sm border-b border-indigo-200 focus:border-indigo-600 outline-none bg-transparent font-bold text-slate-700"
                />
            ) : (
                <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
            )}
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F1F5F9] overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            {/* Enterprise Header Bar */}
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
                                <h2 className="text-xl font-bold text-slate-900 leading-none">{selectedBus.busNumber}</h2>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                    (selectedBus.status || '').toUpperCase() === 'ACTIVE' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {selectedBus.status}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1.5">
                                Vehicle ID: <span className="text-slate-900 font-bold">#{selectedBus.id?.substring(0, 8).toUpperCase()}</span> • Make: <span className="text-slate-900 font-bold">{selectedBus.bus_brand}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
                    
                    {/* Sidebar (Left) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Technical Specifications */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faFingerprint} title="Technical Identity" subtitle="System Specifications" />
                            <div className="space-y-6 pt-2">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600">
                                        <FontAwesomeIcon icon={faIndustry} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manufacturer</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedBus.bus_brand}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <DataRow label="Model Series" value={selectedBus.bus_model} isEditing={isEditing} field="bus_model" />
                                    <DataRow label="Seating Cap." value={`${selectedBus.capacity} Seats`} isEditing={isEditing} field="capacity" type="number" />
                                    <DataRow label="Registration" value={selectedBus.busNumber} isEditing={isEditing} field="busNumber" />
                                    <DataRow label="Fleet Status" value={selectedBus.status} />
                                </div>
                            </div>
                        </div>

                        {/* Driver Assignment Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faUser} title="Designated Pilot" subtitle="Personnel Assignment" />
                            {isEditing ? (
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Driver</p>
                                        <select
                                            value={editData.driver_id || ''}
                                            onChange={(e) => {
                                                const driverId = e.target.value || null;
                                                const driverName = driverId ? (drivers.find(d => d.driver_id === driverId)?.name || 'Assigned') : 'Unassigned';
                                                setEditData({ ...editData, driver_id: driverId, driverName: driverName });
                                            }}
                                            className="w-full px-2 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-600 outline-none bg-slate-50 font-bold text-slate-700"
                                        >
                                            <option value="">Unassigned</option>
                                            {drivers.map(driver => (
                                                <option key={driver.driver_id} value={driver.driver_id}>
                                                    {driver.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
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
                                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Contact Line</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Legal & Compliance Section */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <SectionHeader icon={faShieldAlt} title="Compliance & Legal" subtitle="Statutory Documentation" />
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
                                            <DataRow label="Expiry Date" value={selectedBus.rc_expiry_date} isEditing={isEditing} field="rc_expiry_date" type="date" />
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
                                            {isEditing && (
                                                <DataRow label="RC Image URL" value={selectedBus.rc_book_url} isEditing={true} field="rc_book_url" isFullWidth={true} />
                                            )}
                                        </div>
                                    </div>

                                    {/* FC Details */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                            <FontAwesomeIcon icon={faCalendarCheck} className="text-rose-500 text-xs" />
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Fitness (FC)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <DataRow label="Expiry Date" value={selectedBus.fc_expiry_date} isEditing={isEditing} field="fc_expiry_date" type="date" />
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
                                            {isEditing && (
                                                <DataRow label="FC Image URL" value={selectedBus.fc_certificate_url} isEditing={true} field="fc_certificate_url" isFullWidth={true} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logistics Summary */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faRoute} title="Operational Logistics" subtitle="Route Network" />
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500">
                                        <FontAwesomeIcon icon={faRoute} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Active Route</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedBus.route || 'Standby / Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fleet Status</p>
                                    <p className="text-xs font-bold text-slate-900">Assigned to School Network</p>
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
