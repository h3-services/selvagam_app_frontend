import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faEdit, faArrowLeft, faBus, faUser, faIndustry, faCogs, faCalendarCheck, faIdCard, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const BusDetail = ({ selectedBus, onBack, onUpdate, getStatusColor }) => {
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

    return (
        <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative p-5" style={{ backgroundColor: '#40189d' }}>
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all mr-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="relative">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                <FontAwesomeIcon icon={faBus} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedBus.busNumber}</h2>
                            <p className="text-white/80 text-xs font-medium">Capacity: {selectedBus.capacity} Seats</p>
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-medium">
                                <FontAwesomeIcon icon={faTimes} className="mr-1" />Cancel
                            </button>
                            <button onClick={handleSaveEdit} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                                <FontAwesomeIcon icon={faCheck} className="mr-1" />Save
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Brand */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faIndustry} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Bus Brand</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.bus_brand || ''}
                                    onChange={(e) => setEditData({ ...editData, bus_brand: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedBus.bus_brand || 'N/A'}</p>
                            )}
                        </div>
                    </div>

                    {/* Model */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faCogs} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Bus Model</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.bus_model || ''}
                                    onChange={(e) => setEditData({ ...editData, bus_model: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedBus.bus_model || 'N/A'}</p>
                            )}
                        </div>
                    </div>

                    {/* Assigned Driver */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Assigned Driver</p>
                            <p className="text-lg font-bold text-black">{selectedBus.driverName}</p>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faShieldAlt} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Status</p>
                            {isEditing ? (
                                <select
                                    value={editData?.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedBus.status)}`}>
                                    {selectedBus.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* RC Expiry */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faIdCard} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">RC Expiry Date</p>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData?.rc_expiry_date || ''}
                                    onChange={(e) => setEditData({ ...editData, rc_expiry_date: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className={`text-lg font-bold ${selectedBus.rc_expiry_date && new Date(selectedBus.rc_expiry_date) < new Date() ? 'text-red-500' : 'text-black'}`}>
                                    {selectedBus.rc_expiry_date || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* FC Expiry */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faCalendarCheck} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">FC Expiry Date</p>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData?.fc_expiry_date || ''}
                                    onChange={(e) => setEditData({ ...editData, fc_expiry_date: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className={`text-lg font-bold ${selectedBus.fc_expiry_date && new Date(selectedBus.fc_expiry_date) < new Date() ? 'text-red-500' : 'text-black'}`}>
                                    {selectedBus.fc_expiry_date || 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusDetail;
