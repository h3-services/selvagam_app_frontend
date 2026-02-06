import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faPhone, faChild, faCheck, faUserTie, faCalendar, faSchool, faBus, faMapMarkerAlt, faImage, faWarning } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import { routeService } from '../../services/routeService';

const AddStudentForm = ({ show, onClose, onAdd, parents }) => {
    const defaultFormState = {
        name: '',
        parent_id: '',
        s_parent_id: '',
        dob: '',
        class_id: '',
        pickup_route_id: '',
        drop_route_id: '',
        pickup_stop_id: '',
        drop_stop_id: '',
        emergency_contact: '',
        student_photo_url: '',
    };

    const [formData, setFormData] = useState(defaultFormState);
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [filteredPickupStops, setFilteredPickupStops] = useState([]);
    const [filteredDropStops, setFilteredDropStops] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (show) {
            fetchRoutesAndStops();
        }
    }, [show]);

    const fetchRoutesAndStops = async () => {
        setLoadingData(true);
        try {
            const [routesData, stopsData] = await Promise.all([
                routeService.getAllRoutes(),
                routeService.getAllRouteStops()
            ]);
            setRoutes(routesData || []);
            setStops(stopsData || []);
        } catch (error) {
            console.error("Failed to fetch routes/stops:", error);
        } finally {
            setLoadingData(false);
        }
    };

    // Filter stops when route changes
    useEffect(() => {
        if (formData.pickup_route_id) {
            setFilteredPickupStops(stops.filter(s => s.route_id === formData.pickup_route_id));
        } else {
            setFilteredPickupStops([]);
        }
    }, [formData.pickup_route_id, stops]);

    useEffect(() => {
        if (formData.drop_route_id) {
            setFilteredDropStops(stops.filter(s => s.route_id === formData.drop_route_id));
        } else {
            setFilteredDropStops([]);
        }
    }, [formData.drop_route_id, stops]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Basic validation
        if (!formData.name || !formData.parent_id || !formData.dob) {
            alert("Please fill in required fields: Name, Primary Parent, DOB");
            return;
        }

        // Prepare payload for API
        const payload = {
            ...formData,
            // Ensure numbers where needed
            emergency_contact: formData.emergency_contact ? Number(formData.emergency_contact) : 0
        };

        onAdd(payload);
        setFormData(defaultFormState);
    };

    if (!show) return null;

    return (
        <>
            {/* Drawer Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" onClick={onClose}></div>

            {/* Right Side Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[2000] flex flex-col animate-slide-in">
                {/* Header */}
                <div className="relative p-6 border-b border-purple-100 bg-white">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                            <FontAwesomeIcon icon={faUserPlus} className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Add New Student</h3>
                            <p className="text-gray-500 text-xs">Create a new student profile</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Section: Basic Info */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Student Details</h4>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faChild} /></div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth *</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faCalendar} /></div>
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => handleChange('dob', e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium text-gray-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Class/Grade</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faSchool} /></div>
                                        <input
                                            type="text"
                                            value={formData.class_id}
                                            onChange={(e) => handleChange('class_id', e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                                            placeholder="e.g. 5-A"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Photo URL</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faImage} /></div>
                                    <input
                                        type="text"
                                        value={formData.student_photo_url}
                                        onChange={(e) => handleChange('student_photo_url', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Parents */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Parent/Guardian Info</h4>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Primary Parent *</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faUserTie} /></div>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => handleChange('parent_id', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Primary Parent</option>
                                    {parents.map(p => (
                                        <option key={p.parent_id} value={p.parent_id}>{p.name} ({p.phone})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Parent (Optional)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faUser} /></div>
                                <select
                                    value={formData.s_parent_id}
                                    onChange={(e) => handleChange('s_parent_id', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Secondary Parent</option>
                                    {parents.map(p => (
                                        <option key={p.parent_id} value={p.parent_id}>{p.name} ({p.phone})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faPhone} /></div>
                                <input
                                    type="number"
                                    value={formData.emergency_contact}
                                    onChange={(e) => handleChange('emergency_contact', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-medium"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Transport */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Transport Allocation</h4>
                        
                        <div className="bg-purple-50 rounded-xl p-4 space-y-4">
                            <h5 className="text-xs font-bold text-purple-800 uppercase">Pickup Details</h5>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Route</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faBus} /></div>
                                    <select
                                        value={formData.pickup_route_id}
                                        onChange={(e) => handleChange('pickup_route_id', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-purple-100 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none font-medium"
                                    >
                                        <option value="">Select Pickup Route</option>
                                        {routes.map(r => (
                                            <option key={r.route_id} value={r.route_id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Stop</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                                    <select
                                        value={formData.pickup_stop_id}
                                        onChange={(e) => handleChange('pickup_stop_id', e.target.value)}
                                        disabled={!formData.pickup_route_id}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-purple-100 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select Pickup Stop</option>
                                        {filteredPickupStops.map(s => (
                                            <option key={s.stop_id} value={s.stop_id}>{s.stop_name} (Order: {s.pickup_stop_order})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                         <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                            <h5 className="text-xs font-bold text-blue-800 uppercase">Drop Details</h5>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Route</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faBus} /></div>
                                    <select
                                        value={formData.drop_route_id}
                                        onChange={(e) => handleChange('drop_route_id', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none font-medium"
                                    >
                                        <option value="">Select Drop Route</option>
                                        {routes.map(r => (
                                            <option key={r.route_id} value={r.route_id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Stop</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 text-center"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                                    <select
                                        value={formData.drop_stop_id}
                                        onChange={(e) => handleChange('drop_stop_id', e.target.value)}
                                        disabled={!formData.drop_route_id}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-blue-100 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none font-medium disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select Drop Stop</option>
                                        {filteredDropStops.map(s => (
                                            <option key={s.stop_id} value={s.stop_id}>{s.stop_name} (Order: {s.drop_stop_order})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-purple-100 bg-gray-50 mt-auto">
                    <button
                        onClick={handleSave}
                        className="w-full py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-white text-sm tracking-wide flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        Create Student Profile
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddStudentForm;
