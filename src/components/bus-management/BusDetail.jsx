import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faEdit, faArrowLeft, faBus, faUser, faIndustry, faCogs, faCalendarCheck, faIdCard, faShieldAlt, faRoute, faChair, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

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

    const InfoRow = ({ icon, label, value, isEditing, field, type = "text" }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3A7BFF] shrink-0">
                <FontAwesomeIcon icon={icon} className="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                {isEditing ? (
                    <input
                        type={type}
                        value={editData?.[field] || ''}
                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                        className="w-full mt-1 px-2 py-1 text-sm border-b border-purple-200 focus:border-[#3A7BFF] outline-none bg-transparent font-medium text-gray-900"
                    />
                ) : (
                    <p className="text-sm font-bold text-gray-700 truncate">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Header Toolbar */}
            <div className="relative p-8 border-b border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all shadow-md"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#3A7BFF' }}>Vehicle Profile</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Manage bus details & documentation</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTimes} /> Cancel
                                </button>
                                <button onClick={handleSaveEdit} className="px-6 py-2.5 text-white rounded-xl hover:shadow-xl transition-all text-sm font-bold flex items-center gap-2 bg-[#3A7BFF]">
                                    <FontAwesomeIcon icon={faCheck} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center gap-2 bg-[#3A7BFF]">
                                <FontAwesomeIcon icon={faEdit} /> Edit Bus
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    
                    {/* Left Column - Bus Profile */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-blue-50 p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-100 transition-all">
                            
                            <div className="relative z-10 w-28 h-28 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-blue-50 mb-6 flex items-center justify-center text-[#3A7BFF] text-4xl">
                                <FontAwesomeIcon icon={faBus} />
                            </div>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.busNumber}
                                    onChange={(e) => setEditData({ ...editData, busNumber: e.target.value })}
                                    className="text-xl font-bold text-gray-900 mb-2 text-center bg-transparent border-b border-purple-200 focus:border-[#3A7BFF] outline-none relative z-10"
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-[#3A7BFF] mb-2 relative z-10">{selectedBus.busNumber}</h3>
                            )}

                            <div className="flex items-center gap-3 mb-8 relative z-10 flex-wrap justify-center">
                                {isEditing ? (
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white font-bold text-gray-700 outline-none focus:border-[#3A7BFF]"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        selectedBus.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                        selectedBus.status === 'Maintenance' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                                    }`}>
                                        {selectedBus.status}
                                    </span>
                                )}
                            </div>

                            <div className="w-full bg-gray-50/50 rounded-2xl p-1 border border-gray-100 text-left space-y-1">
                                <InfoRow icon={faIndustry} label="Make" value={selectedBus.bus_brand} isEditing={isEditing} field="bus_brand" />
                                <InfoRow icon={faCogs} label="Model" value={selectedBus.bus_model} isEditing={isEditing} field="bus_model" />
                                <InfoRow icon={faChair} label="Capacity" value={`${selectedBus.capacity} Seats`} isEditing={isEditing} field="capacity" type="number" />
                            </div>
                        </div>


                    </div>

                    {/* Right Column - Details */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {/* Operational Info */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-blue-50 p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50"></div>
                            
                            <h3 className="text-lg font-black text-[#3A7BFF] mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3A7BFF] border border-blue-100">
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                </span>
                                Operational Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border-b border-gray-100 md:border-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3A7BFF] shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Assigned Driver</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {isEditing ? (
                                                <select
                                                    value={editData.driver_id || ''}
                                                    onChange={(e) => {
                                                        const driverId = e.target.value || null;
                                                        const driverName = driverId ? (drivers.find(d => d.driver_id === driverId)?.name || 'Assigned') : 'Unassigned';
                                                        setEditData({ ...editData, driver_id: driverId, driverName: driverName });
                                                    }}
                                                    className="w-full text-sm border-b border-purple-200 focus:border-[#3A7BFF] outline-none bg-transparent font-medium text-gray-900"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {drivers.map(driver => (
                                                        <option key={driver.driver_id} value={driver.driver_id}>
                                                            {driver.name} ({driver.phone})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-700 truncate">{selectedBus.driverName || 'Unassigned'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border-b border-gray-100 md:border-0 w-full">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3A7BFF] shrink-0">
                                        <FontAwesomeIcon icon={faRoute} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Assigned Route</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{selectedBus.route || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <InfoRow icon={faIdCard} label="RC Expiry" value={selectedBus.rc_expiry_date} isEditing={isEditing} field="rc_expiry_date" type="date" />
                                <InfoRow icon={faCalendarCheck} label="FC Expiry" value={selectedBus.fc_expiry_date} isEditing={isEditing} field="fc_expiry_date" type="date" />
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-blue-50 p-8 flex-1">
                            <h3 className="text-lg font-black text-[#3A7BFF] mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3A7BFF] border border-blue-100">
                                    <FontAwesomeIcon icon={faIdCard} />
                                </span>
                                Legal Documents
                            </h3>
                            
                            {isEditing ? (
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <InfoRow icon={faIdCard} label="RC Book URL" value={selectedBus.rc_book_url} isEditing={true} field="rc_book_url" />
                                    <InfoRow icon={faCalendarCheck} label="FC Certificate URL" value={selectedBus.fc_certificate_url} isEditing={true} field="fc_certificate_url" />
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* RC Book Card */}
                                <div className="group relative rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all bg-gray-50 h-[220px]">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#3A7BFF] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
                                        RC Book Notarized
                                    </div>
                                    {selectedBus.rc_book_url ? (
                                        <>
                                            <img src={selectedBus.rc_book_url} alt="RC Book" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-[#3A7BFF]/0 group-hover:bg-[#3A7BFF]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                                <button className="bg-white text-[#3A7BFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">View Document</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faIdCard} className="text-5xl mb-3 opacity-20" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-50">No Document</span>
                                        </div>
                                    )}
                                </div>

                                {/* FC Certificate Card */}
                                <div className="group relative rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all bg-gray-50 h-[220px]">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#3A7BFF] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
                                        FC Certificate
                                    </div>
                                    {selectedBus.fc_certificate_url ? (
                                        <>
                                            <img src={selectedBus.fc_certificate_url} alt="FC Certificate" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-[#3A7BFF]/0 group-hover:bg-[#3A7BFF]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                                <button className="bg-white text-[#3A7BFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">View Document</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faCalendarCheck} className="text-5xl mb-3 opacity-20" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-50">No Document</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusDetail;
