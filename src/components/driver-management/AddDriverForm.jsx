import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faEnvelope, faPhone, faIdCard, faCar, faRoute, faCheck } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const AddDriverForm = ({ show, onClose, onAdd }) => {
    const [newDriver, setNewDriver] = useState({ name: '', email: '', mobile: '', licenseNumber: '', vehicleNumber: '', route: '', status: 'Active' });

    const handleAdd = () => {
        if (newDriver.name && newDriver.email) {
            onAdd(newDriver);
            setNewDriver({ name: '', email: '', mobile: '', licenseNumber: '', vehicleNumber: '', route: '', status: 'Active' });
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" onClick={onClose}></div>
            <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[2000] flex flex-col animate-slide-in">
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
                            <FontAwesomeIcon icon={faUserPlus} className="text-white text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Driver</h3>
                            <p className="text-gray-500 text-sm">Enter driver information</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Driver Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faUser} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={newDriver.name}
                                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faEnvelope} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="driver@example.com"
                                    value={newDriver.email}
                                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="9876543210"
                                    value={newDriver.mobile}
                                    onChange={(e) => setNewDriver({ ...newDriver, mobile: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>License Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faIdCard} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="DL-2024-XXX"
                                    value={newDriver.licenseNumber}
                                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Vehicle Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faCar} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Bus 1 - TN 33 AA 1234"
                                    value={newDriver.vehicleNumber}
                                    onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Assigned Route</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faRoute} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Route 101"
                                    value={newDriver.route}
                                    onChange={(e) => setNewDriver({ ...newDriver, route: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Status</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faCheck} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <select
                                    value={newDriver.status}
                                    onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm appearance-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
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
                        Add Driver
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddDriverForm;
