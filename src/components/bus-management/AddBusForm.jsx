import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBus, faUserFriends, faUser, faPhone, faCheck } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const AddBusForm = ({ show, onClose, onAdd, drivers = [], routes = [] }) => {
    const [newBus, setNewBus] = useState({ 
        registration_number: '', 
        vehicle_type: 'School Bus', 
        bus_brand: '', 
        bus_model: '', 
        seating_capacity: '', 
        status: 'Active',
        driver_id: '',
        route_id: '',
        rc_expiry_date: '',
        fc_expiry_date: '',
        rc_book_url: '',
        fc_certificate_url: ''
    });

    const handleTestFill = () => {
        setNewBus({
            registration_number: `TN${Math.floor(Math.random() * 90) + 10}AB${Math.floor(Math.random() * 9000) + 1000}`,
            vehicle_type: ['School Bus', 'Mini', 'Van'][Math.floor(Math.random() * 3)],
            bus_brand: ['Tata', 'Ashok Leyland', 'Eicher', 'Force'][Math.floor(Math.random() * 4)],
            bus_model: ['Starbus', 'Viking', 'Pro 3000', 'Traveller'][Math.floor(Math.random() * 4)],
            seating_capacity: Math.floor(Math.random() * 30) + 20,
            status: ['Active', 'Maintenance', 'Inactive'][Math.floor(Math.random() * 3)],
            driver_id: drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)].driver_id : '',
            route_id: routes.length > 0 ? routes[Math.floor(Math.random() * routes.length)].route_id : '',
            rc_expiry_date: new Date(Date.now() + Math.random() * 31536000000).toISOString().split('T')[0],
            fc_expiry_date: new Date(Date.now() + Math.random() * 15768000000).toISOString().split('T')[0],
            rc_book_url: 'https://example.com/rc_book.pdf',
            fc_certificate_url: 'https://example.com/fc_cert.pdf'
        });
    };

    const handleAdd = () => {
        if (newBus.registration_number && newBus.vehicle_type) {
            onAdd(newBus);
            setNewBus({ 
                registration_number: '', 
                vehicle_type: 'School Bus', 
                bus_brand: '', 
                bus_model: '', 
                seating_capacity: '', 
                status: 'Active',
                driver_id: '',
                route_id: '',
                rc_expiry_date: '',
                fc_expiry_date: '',
                rc_book_url: '',
                fc_certificate_url: ''
            });
        }
    };

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [show]);

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1500]" onClick={onClose}></div>
            <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[1501] flex flex-col animate-slide-in">
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
                            <p className="text-gray-500 text-sm">Enter detailed bus vehicle information</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-6">
                        
                        {/* Registration & Type Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Reg. Number *</label>
                                <input
                                    type="text"
                                    placeholder="TN01AB1234"
                                    value={newBus.registration_number}
                                    onChange={(e) => setNewBus({ ...newBus, registration_number: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Type *</label>
                                <select
                                    value={newBus.vehicle_type}
                                    onChange={(e) => setNewBus({ ...newBus, vehicle_type: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                >
                                    <option value="School Bus">School Bus</option>
                                    <option value="Mini">Mini Bus</option>
                                    <option value="Van">Van</option>
                                </select>
                            </div>
                        </div>

                        {/* Brand & Model Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Brand</label>
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    value={newBus.bus_brand}
                                    onChange={(e) => setNewBus({ ...newBus, bus_brand: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Model</label>
                                <input
                                    type="text"
                                    placeholder="Model"
                                    value={newBus.bus_model}
                                    onChange={(e) => setNewBus({ ...newBus, bus_model: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Capacity & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Capacity</label>
                                <input
                                    type="number"
                                    placeholder="Seats"
                                    value={newBus.seating_capacity}
                                    onChange={(e) => setNewBus({ ...newBus, seating_capacity: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Status</label>
                                <select
                                    value={newBus.status}
                                    onChange={(e) => setNewBus({ ...newBus, status: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Driver & Route Assignment */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Assign Driver</label>
                            <select
                                value={newBus.driver_id}
                                onChange={(e) => setNewBus({ ...newBus, driver_id: e.target.value })}
                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                            >
                                <option value="">Select Driver (Optional)</option>
                                {drivers.map(driver => (
                                    <option key={driver.driver_id} value={driver.driver_id}>
                                        {driver.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Assign Route</label>
                            <select
                                value={newBus.route_id}
                                onChange={(e) => setNewBus({ ...newBus, route_id: e.target.value })}
                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                            >
                                <option value="">Select Route (Optional)</option>
                                {routes.map(route => (
                                    <option key={route.route_id} value={route.route_id}>
                                        {route.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Expiry Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>RC Expiry Date</label>
                                <input
                                    type="date"
                                    value={newBus.rc_expiry_date}
                                    onChange={(e) => setNewBus({ ...newBus, rc_expiry_date: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-500 focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>FC Expiry Date</label>
                                <input
                                    type="date"
                                    value={newBus.fc_expiry_date}
                                    onChange={(e) => setNewBus({ ...newBus, fc_expiry_date: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm text-gray-500 focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>RC Book URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newBus.rc_book_url}
                                onChange={(e) => setNewBus({ ...newBus, rc_book_url: e.target.value })}
                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>FC Certificate URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newBus.fc_certificate_url}
                                onChange={(e) => setNewBus({ ...newBus, fc_certificate_url: e.target.value })}
                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                            />
                        </div>

                    </div>
                </div>

                <div className="p-8 border-t border-purple-100 bg-white flex gap-3">
                    <button
                        onClick={handleTestFill}
                        className="flex-1 py-4 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-all text-base"
                    >
                        Test Fill
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={!newBus.registration_number}
                        className="flex-[2] py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
