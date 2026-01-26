import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faTimes, faCheck, faEdit, faEnvelope, faPhone, faIdCard, faCar } from '@fortawesome/free-solid-svg-icons';

const DriverDetail = ({ selectedDriver, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (selectedDriver) {
            setEditData({ ...selectedDriver });
        }
    }, [selectedDriver]);

    const handleSaveEdit = () => {
        const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
        onUpdate(updatedData);
        setIsEditing(false);
    };

    if (!selectedDriver) return null;

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
                                {selectedDriver.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                                <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#40189d' }} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedDriver.name}</h2>
                            <p className="text-white/80 text-xs font-medium">Driver Account • {selectedDriver.date}</p>
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
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faEnvelope} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Email Address</p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData?.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-sm font-semibold text-black break-all">{selectedDriver.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faPhone} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Mobile Number</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData?.mobile}
                                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedDriver.mobile}</p>
                            )}
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faIdCard} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">License Number</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.licenseNumber}
                                    onChange={(e) => setEditData({ ...editData, licenseNumber: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedDriver.licenseNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faCar} className="text-white text-sm" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Vehicle Number</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.vehicleNumber}
                                    onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedDriver.vehicleNumber}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetail;
