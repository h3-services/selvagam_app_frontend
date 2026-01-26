import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBus, faUserFriends, faUser, faPhone, faCheck } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const AddBusForm = ({ show, onClose, onAdd }) => {
    const [newBus, setNewBus] = useState({ busNumber: '', capacity: '', driverName: '', contactNumber: '', status: 'Active' });

    const handleAdd = () => {
        if (newBus.busNumber && newBus.driverName) {
            onAdd(newBus);
            setNewBus({ busNumber: '', capacity: '', driverName: '', contactNumber: '', status: 'Active' });
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1500]" onClick={onClose}></div>
            <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[1501] flex flex-col animate-slide-in">
                <div className="relative p-8 border-b border-purple-100">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                        style={{ color: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                            <FontAwesomeIcon icon={faBus} className="text-white text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Bus</h3>
                            <p className="text-gray-500 text-sm">Enter bus vehicle details</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Bus Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faBus} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. BUS-101"
                                    value={newBus.busNumber}
                                    onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Capacity</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faUserFriends} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Number of seats"
                                    value={newBus.capacity}
                                    onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Driver Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faUser} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Assigned Driver Name"
                                    value={newBus.driverName}
                                    onChange={(e) => setNewBus({ ...newBus, driverName: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Contact Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Primary contact"
                                    value={newBus.contactNumber}
                                    onChange={(e) => setNewBus({ ...newBus, contactNumber: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Status</label>
                            <div className="flex gap-2">
                                {['Active', 'Maintenance', 'Inactive'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setNewBus({ ...newBus, status })}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all ${newBus.status === status
                                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-purple-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-purple-100 bg-white">
                    <button
                        onClick={handleAdd}
                        className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Add Bus
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddBusForm;
