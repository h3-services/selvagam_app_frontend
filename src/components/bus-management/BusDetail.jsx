import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faEdit, faArrowLeft, faBus, faUser } from '@fortawesome/free-solid-svg-icons';

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
                    {/* Driver Card */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="relative p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Assigned Driver</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.driverName}
                                    onChange={(e) => setEditData({ ...editData, driverName: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                            ) : (
                                <p className="text-lg font-bold text-black">{selectedBus.driverName}</p>
                            )}
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                        <div className="relative p-4">
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
                </div>
            </div>
        </div>
    );
};

export default BusDetail;
