import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faPhone, faChild, faCheck, faUserTie, faCalendar, faSchool, faBus, faMapMarkerAlt, faImage, faWarning, faHome, faEnvelope, faLock, faArrowRight, faSearch, faChevronDown, faMagic } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import { routeService } from '../../services/routeService';
import { parentService } from '../../services/parentService';
import { classService } from '../../services/classService';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false }) => (
    <div className="relative group">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-xl border border-gray-200 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 ${disabled ? 'bg-gray-50' : 'hover:border-purple-300'}`}>
            <div className="w-10 h-full flex items-center justify-center text-gray-400 absolute left-0 top-0 pointer-events-none">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-transparent rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none disabled:text-gray-500"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon, value, onChange, options, placeholder, disabled = false, renderOption }) => (
    <div className="relative group">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-xl border border-gray-200 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 ${disabled ? 'bg-gray-50' : 'hover:border-purple-300'}`}>
            <div className="w-10 h-full flex items-center justify-center text-gray-400 absolute left-0 top-0 pointer-events-none">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-transparent rounded-xl text-sm font-medium text-gray-800 focus:outline-none appearance-none disabled:text-gray-500 cursor-pointer"
            >
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
    </div>
);

const AddStudentForm = ({ show, onClose, onAdd, parents }) => {
    const defaultStudentState = {
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

    const defaultParentState = {
        name: '',
        phone: '',
        email: '',
        parent_role: 'GUARDIAN', // Default per schema
        door_no: '',
        street: '',
        city: '',
        district: '',
        pincode: '',
        password: ''
    };

    const [formData, setFormData] = useState(defaultStudentState);
    const [newParent, setNewParent] = useState(defaultParentState);
    
    // UI State
    const [isAddingNewParent, setIsAddingNewParent] = useState(false);
    const [isSearchingParent, setIsSearchingParent] = useState(false); // New state
    const [parentSearchQuery, setParentSearchQuery] = useState(''); // New state
    const [targetParentField, setTargetParentField] = useState('parent_id'); // 'parent_id' or 's_parent_id'
    const [localParents, setLocalParents] = useState([]);
    
    // Data State
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filteredPickupStops, setFilteredPickupStops] = useState([]);
    const [filteredDropStops, setFilteredDropStops] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingParent, setLoadingParent] = useState(false);

    useEffect(() => {
        if (parents) {
            setLocalParents(parents);
        }
    }, [parents]);

    useEffect(() => {
        if (show) {
            fetchRoutesAndStops();
        }
    }, [show]);

    const fetchRoutesAndStops = async () => {
        setLoadingData(true);
        try {
            const [routesData, stopsData, classesData] = await Promise.all([
                routeService.getAllRoutes(),
                routeService.getAllRouteStops(),
                classService.getAllClasses()
            ]);
            setRoutes(routesData || []);
            setStops(stopsData || []);
            setClasses(classesData || []);
        } catch (error) {
            console.error("Failed to fetch routes/stops/classes:", error);
        } finally {
            setLoadingData(false);
        }
    };

    // Filter stops
    useEffect(() => {
        setFilteredPickupStops(formData.pickup_route_id ? stops.filter(s => s.route_id === formData.pickup_route_id) : []);
    }, [formData.pickup_route_id, stops]);

    useEffect(() => {
        setFilteredDropStops(formData.drop_route_id ? stops.filter(s => s.route_id === formData.drop_route_id) : []);
    }, [formData.drop_route_id, stops]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleParentChange = (field, value) => {
        setNewParent(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateParent = async () => {
        if (!newParent.name || !newParent.phone || !newParent.parent_role) {
            alert("Please fill required parent fields (Name, Phone, Role)");
            return;
        }
        
        setLoadingParent(true);
        try {
            // Most APIs expect phone as a string (preserves formatting, leading zeros, etc.)
            const payload = {
                ...newParent,
                phone: String(newParent.phone).trim(),
            };
            
            console.log("Parent Payload:", JSON.stringify(payload, null, 2));
            const createdParent = await parentService.createParent(payload);
            
            // Normalize parent_id from API response (handle different response structures)
            const parentId = createdParent.parent_id || createdParent.id || createdParent.data?.parent_id;
            if (!parentId) {
                throw new Error("Failed to get parent ID from response");
            }
            
            const newParentEntry = {
                ...createdParent,
                name: newParent.name,
                phone: newParent.phone,
                parent_id: parentId
            };

            setLocalParents(prev => [...prev, newParentEntry]);
            setFormData(prev => ({ ...prev, [targetParentField]: newParentEntry.parent_id }));
            setIsAddingNewParent(false);
            setNewParent(defaultParentState);
            
        } catch (error) {
            console.error("Failed to create parent:", error);
            alert("Failed to create parent. Please check inputs.");
        } finally {
            setLoadingParent(false);
        }
    };

    const handleSaveStudent = () => {
        if (!formData.name || !formData.parent_id || !formData.dob) {
            alert("Please fill in required fields: Name, Primary Parent, DOB");
            return;
        }

        // Validate: pickup and drop stops cannot be the same
        if (formData.pickup_stop_id && formData.drop_stop_id && 
            formData.pickup_stop_id === formData.drop_stop_id) {
            alert("Pickup stop and Drop stop cannot be the same. Please select different stops.");
            return;
        }

        // Build payload matching the working Swagger example exactly
        const payload = {
            name: formData.name,
            parent_id: formData.parent_id,
            dob: formData.dob,
            s_parent_id: formData.s_parent_id || null, // Backend requires this field (even as null)
        };

        // Add optional fields only if they have actual values
        if (formData.class_id) payload.class_id = formData.class_id;
        if (formData.pickup_route_id) payload.pickup_route_id = formData.pickup_route_id;
        if (formData.drop_route_id) payload.drop_route_id = formData.drop_route_id;
        if (formData.pickup_stop_id) payload.pickup_stop_id = formData.pickup_stop_id;
        if (formData.drop_stop_id) payload.drop_stop_id = formData.drop_stop_id;
        if (formData.emergency_contact) payload.emergency_contact = Number(formData.emergency_contact);
        if (formData.student_photo_url) payload.student_photo_url = formData.student_photo_url;

        console.log("Student Payload:", JSON.stringify(payload, null, 2));
        onAdd(payload);
        setFormData(defaultStudentState);
        setIsAddingNewParent(false);
        setIsSearchingParent(false);
    };



    const handleAutoFill = () => {
        const dummyStudent = {
            name: "Siranjeevan",
            dob: "2016-08-15",
            gender: "Male",
            blood_group: "B+",
            // Use first active class from the fetched list
            class_id: classes.find(c => c.status === 'ACTIVE')?.class_id || "", 
            section: "B",
            roll_no: "42",
            admission_no: "ADM-2024-050",
            address: "45/2, Green Avenue, Bangalore",
            emergency_contact: "9876543210",
            pickup_route_id: routes[0]?.route_id || "",
            // Pickup stop logic would ideally filter, but for demo we just pick first if available
            pickup_stop_id: stops[0]?.stop_id || "", 
            drop_route_id: routes[0]?.route_id || "",
            drop_stop_id: stops[0]?.stop_id || "",
            student_photo_url: "https://randomuser.me/api/portraits/lego/1.jpg"
        };
        setFormData(prev => ({ ...prev, ...dummyStudent }));
        
        setNewParent({
            name: "Rajesh Sharma",
            phone: "9876543210",
            email: "rajesh.sharma@example.com",
            parent_role: "FATHER",
            password: "password123",
            door_no: "45/2",
            street: "Green Avenue",
            city: "Bangalore",
            district: "Urban",
            pincode: "560001"
        });

        if (localParents.length > 0) {
             setFormData(prev => ({ ...prev, parent_id: localParents[0].parent_id }));
        }
    };

    // Reset form when drawer closes
    const handleClose = () => {
        setFormData(defaultStudentState);
        setNewParent(defaultParentState);
        setIsAddingNewParent(false);
        setIsSearchingParent(false);
        setParentSearchQuery('');
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1999] transition-opacity duration-300" onClick={handleClose} />
            
            <div className={`fixed right-0 top-0 h-full bg-slate-50 shadow-2xl z-[2000] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
                (isAddingNewParent || isSearchingParent) ? 'w-full sm:w-[1100px]' : 'w-full sm:w-[500px]'
            }`}>
                
                {/* Modern Header */}
                <div className="relative px-8 py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex-shrink-0 z-10 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                       <div className="relative">
                            <div className="absolute inset-0 bg-purple-600 blur-lg opacity-20 rounded-full"></div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-xl relative z-10 text-white">
                                <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                            </div>
                       </div>
                        <div>
                            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Add Student</h3>
                            <p className="text-gray-500 text-sm font-medium">Enter details to register a new student</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleAutoFill}
                            className="h-10 px-4 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs gap-2 transition-colors duration-200"
                            title="Auto Fill Demo Data"
                        >
                            <FontAwesomeIcon icon={faMagic} /> Auto Fill
                        </button>
                        <button 
                            onClick={handleClose} 
                            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-hidden relative">
                    <div className={`h-full grid ${(isAddingNewParent || isSearchingParent) ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} divide-x divide-gray-200`}>
                        
                        {/* LEFT PANEL: Student Form */}
                        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar h-full">
                            <div className="p-6 md:p-8 space-y-8 bg-slate-50 min-h-full">
                                
                                {/* Section: Personal Details */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faChild} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Student Information</h4>
                                            <p className="text-xs text-gray-500 font-medium">Personal details and identification</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <InputField 
                                            label="Full Name" 
                                            icon={faUser} 
                                            value={formData.name} 
                                            onChange={(e) => handleChange('name', e.target.value)} 
                                            placeholder="e.g. Michael Scott" 
                                        />

                                            <InputField 
                                                label="Date of Birth" 
                                                icon={faCalendar} 
                                                type="date"
                                                value={formData.dob} 
                                                onChange={(e) => handleChange('dob', e.target.value)} 
                                            />
                                            <SelectField 
                                                label="Class" 
                                                icon={faSchool} 
                                                value={formData.class_id} 
                                                onChange={(e) => handleChange('class_id', e.target.value)} 
                                                placeholder="Select Class"
                                                options={classes.filter(c => c.status === 'ACTIVE').map(c => ({
                                                    value: c.class_id, 
                                                    label: `Class ${c.class_name} - Section ${c.section} (${c.academic_year})`
                                                }))} 
                                            />
                                        
                                        <InputField 
                                            label="Photo URL (Optional)" 
                                            icon={faImage} 
                                            value={formData.student_photo_url} 
                                            onChange={(e) => handleChange('student_photo_url', e.target.value)} 
                                            placeholder="https://..." 
                                        />
                                    </div>
                                </div>

                                {/* Section: Parent/Guardian Link */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUserTie} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Parent Association</h4>
                                            <p className="text-xs text-gray-500 font-medium">Link a guardian to this student</p>
                                        </div>
                                    </div>

                                    <div>
                                        {formData.parent_id ? (() => {
                                            const selectedParent = localParents.find(p => p.parent_id == formData.parent_id);
                                            return selectedParent ? (
                                                <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-5 relative group">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl shadow-sm">
                                                                {selectedParent.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-xl text-gray-900 mb-1">{selectedParent.name}</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200">
                                                                        {selectedParent.parent_role || 'GUARDIAN'}
                                                                    </span>
                                                                    <span className="bg-white text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-2">
                                                                        <FontAwesomeIcon icon={faPhone} className="text-[10px]" /> {selectedParent.phone}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200">
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-5 pt-4 border-t border-purple-100 flex justify-end">
                                                        <button 
                                                            onClick={() => { handleChange('parent_id', ''); }}
                                                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-all"
                                                        >
                                                            Unlink / Change Parent
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })() : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => { setTargetParentField('parent_id'); setIsAddingNewParent(false); setIsSearchingParent(true); }}
                                                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 hover:scale-[1.02] transition-all duration-300 group text-center"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                        <FontAwesomeIcon icon={faSearch} className="text-lg" />
                                                    </div>
                                                    <h5 className="font-bold text-gray-900 text-sm">Search Database</h5>
                                                    <p className="text-xs text-gray-500 mt-1">Find existing parent</p>
                                                </button>

                                                <button 
                                                    onClick={() => { setTargetParentField('parent_id'); setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 group text-center"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                        <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                                                    </div>
                                                    <h5 className="font-bold text-gray-900 text-sm">Register New</h5>
                                                    <p className="text-xs text-gray-500 mt-1">Create parent account</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Secondary Parent (Optional) */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUserTie} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Secondary Parent (Optional)</h4>
                                            <p className="text-xs text-gray-500 font-medium">Additional guardian details</p>
                                        </div>
                                    </div>

                                    <div>
                                        {formData.s_parent_id ? (() => {
                                            const selectedParent = localParents.find(p => p.parent_id == formData.s_parent_id);
                                            return selectedParent ? (
                                                <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 relative group">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-sm">
                                                                {selectedParent.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-xl text-gray-900 mb-1">{selectedParent.name}</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-200">
                                                                        {selectedParent.parent_role || 'GUARDIAN'}
                                                                    </span>
                                                                    <span className="bg-white text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-2">
                                                                        <FontAwesomeIcon icon={faPhone} className="text-[10px]" /> {selectedParent.phone}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200">
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-5 pt-4 border-t border-indigo-100 flex justify-end">
                                                        <button 
                                                            onClick={() => { handleChange('s_parent_id', ''); }}
                                                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-all"
                                                        >
                                                            Unlink / Change Parent
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })() : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => { setTargetParentField('s_parent_id'); setIsAddingNewParent(false); setIsSearchingParent(true); }}
                                                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-[1.02] transition-all duration-300 group text-center"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                        <FontAwesomeIcon icon={faSearch} className="text-lg" />
                                                    </div>
                                                    <h5 className="font-bold text-gray-900 text-sm">Search Database</h5>
                                                    <p className="text-xs text-gray-500 mt-1">Find existing parent</p>
                                                </button>

                                                <button 
                                                    onClick={() => { setTargetParentField('s_parent_id'); setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 hover:scale-[1.02] transition-all duration-300 group text-center"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                        <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                                                    </div>
                                                    <h5 className="font-bold text-gray-900 text-sm">Register New</h5>
                                                    <p className="text-xs text-gray-500 mt-1">Create parent account</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Transport */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faBus} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Transport Route</h4>
                                            <p className="text-xs text-gray-500 font-medium">Bus pickup and drop assignment</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {/* Pickup Sub-Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                                                <FontAwesomeIcon icon={faArrowRight} /> Pickup Details
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <SelectField 
                                                    label="Route" 
                                                    icon={faBus} 
                                                    value={formData.pickup_route_id} 
                                                    onChange={(e) => handleChange('pickup_route_id', e.target.value)} 
                                                    placeholder="Select Route"
                                                    options={routes.map(r => ({value: r.route_id, label: r.name}))} 
                                                />
                                                <SelectField 
                                                    label="Stop Content" 
                                                    icon={faMapMarkerAlt} 
                                                    value={formData.pickup_stop_id} 
                                                    onChange={(e) => handleChange('pickup_stop_id', e.target.value)} 
                                                    placeholder={formData.pickup_route_id ? "Select Stop" : "Select Route First"}
                                                    disabled={!formData.pickup_route_id}
                                                    options={filteredPickupStops.map(s => ({value: s.stop_id, label: `${s.stop_name} (Order: ${s.pickup_stop_order})`}))} 
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-dashed border-gray-200"></div>

                                        {/* Drop Sub-Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                                                <FontAwesomeIcon icon={faHome} /> Drop Details
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <SelectField 
                                                    label="Route" 
                                                    icon={faBus} 
                                                    value={formData.drop_route_id} 
                                                    onChange={(e) => handleChange('drop_route_id', e.target.value)} 
                                                    placeholder="Select Route"
                                                    options={routes.map(r => ({value: r.route_id, label: r.name}))} 
                                                />
                                                <SelectField 
                                                    label="Stop Point" 
                                                    icon={faMapMarkerAlt} 
                                                    value={formData.drop_stop_id} 
                                                    onChange={(e) => handleChange('drop_stop_id', e.target.value)} 
                                                    placeholder={formData.drop_route_id ? "Select Stop" : "Select Route First"}
                                                    disabled={!formData.drop_route_id}
                                                    options={filteredDropStops.map(s => ({value: s.stop_id, label: `${s.stop_name} (Order: ${s.drop_stop_order})`}))} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="h-6"></div> {/* Bottom Spacer */}
                            </div>
                        </div>

                        {/* RIGHT PANEL: Search / New Parent */}
                        {(isAddingNewParent || isSearchingParent) && (
                            <div className="bg-gray-50 flex flex-col h-full overflow-hidden animate-in slide-in-from-right-10 duration-500 shadow-inner relative">

                                {isAddingNewParent && (
                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-0 relative">
                                        <button 
                                            onClick={() => setIsAddingNewParent(false)} 
                                            className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                        </button>
                                        <div className="space-y-8 max-w-lg mx-auto pt-2">

                                            <div className="grid grid-cols-1 gap-6">
                                                <InputField label="Parent Name" icon={faUserTie} value={newParent.name} onChange={(e) => handleParentChange('name', e.target.value)} placeholder="Full Legal Name" />
                                                <div className="grid grid-cols-2 gap-5">
                                                    <SelectField 
                                                        label="Role" icon={faUser} value={newParent.parent_role} onChange={(e) => handleParentChange('parent_role', e.target.value)} placeholder="Role"
                                                        options={[{value: 'GUARDIAN', label: 'Guardian'}, {value: 'FATHER', label: 'Father'}, {value: 'MOTHER', label: 'Mother'}]}
                                                    />
                                                    <InputField label="Phone Number" icon={faPhone} type="number" value={newParent.phone} onChange={(e) => handleParentChange('phone', e.target.value)} placeholder="10-digit Mobile" />
                                                </div>
                                                <InputField label="Email Address" icon={faEnvelope} type="email" value={newParent.email} onChange={(e) => handleParentChange('email', e.target.value)} placeholder="email@example.com" />
                                                <InputField label="Password" icon={faLock} type="password" value={newParent.password} onChange={(e) => handleParentChange('password', e.target.value)} placeholder="Set Password" />
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">Residential Address</h5>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-1"><InputField label="Door No" icon={faHome} value={newParent.door_no} onChange={(e) => handleParentChange('door_no', e.target.value)} /></div>
                                                    <div className="col-span-2"><InputField label="Street" icon={faMapMarkerAlt} value={newParent.street} onChange={(e) => handleParentChange('street', e.target.value)} /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputField label="City" icon={faMapMarkerAlt} value={newParent.city} onChange={(e) => handleParentChange('city', e.target.value)} />
                                                    <InputField label="District" icon={faMapMarkerAlt} value={newParent.district} onChange={(e) => handleParentChange('district', e.target.value)} />
                                                </div>
                                                <InputField label="Pincode" icon={faMapMarkerAlt} value={newParent.pincode} onChange={(e) => handleParentChange('pincode', e.target.value)} />
                                            </div>

                                            <button 
                                                onClick={handleCreateParent} disabled={loadingParent}
                                                className="w-full py-4 rounded-xl font-bold bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loadingParent ? 'Processing...' : 'Save & Link Parent'}
                                                {!loadingParent && <FontAwesomeIcon icon={faArrowRight} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isSearchingParent && (
                                    <div className="flex-1 flex flex-col overflow-hidden p-8 min-h-0 bg-slate-50/50 relative">
                                        <button 
                                            onClick={() => setIsSearchingParent(false)} 
                                            className="absolute top-6 right-6 w-8 h-8 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center hover:shadow-md transition-all z-20"
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                        <div className="max-w-xl mx-auto w-full flex flex-col flex-1 min-h-0 mt-4">
                                            <div className="relative mb-6 shrink-0 group">
                                                <div className="absolute inset-0 bg-purple-200 blur-xl opacity-20 rounded-3xl group-focus-within:opacity-40 transition-opacity"></div>
                                                <div className="relative bg-white rounded-xl shadow-lg shadow-purple-900/5 flex items-center border border-gray-100 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
                                                    <div className="pl-4 text-gray-400 text-sm">
                                                        <FontAwesomeIcon icon={faSearch} />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        autoFocus
                                                        placeholder="Search by parent name, phone, or email..." 
                                                        value={parentSearchQuery}
                                                        onChange={(e) => setParentSearchQuery(e.target.value)}
                                                        className="w-full px-4 py-3 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 min-h-0">
                                                <div className="space-y-4 pb-4">
                                                    {localParents.filter(p => 
                                                        p.name.toLowerCase().includes(parentSearchQuery.toLowerCase()) || 
                                                        p.phone.toString().includes(parentSearchQuery) ||
                                                        (p.email && p.email.toLowerCase().includes(parentSearchQuery.toLowerCase()))
                                                    ).map(p => {
                                                        const isSelected = formData[targetParentField] == p.parent_id;
                                                        return (
                                                            <div 
                                                                key={p.parent_id} 
                                                                onClick={() => { handleChange(targetParentField, p.parent_id); setIsSearchingParent(false); }}
                                                                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative group overflow-hidden
                                                                    ${isSelected 
                                                                        ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-md' 
                                                                        : 'bg-white border-gray-100 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5'}`}
                                                            >
                                                                <div className="flex items-start gap-4 z-10 relative">
                                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm shrink-0
                                                                        ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors'}`}>
                                                                        {p.name.charAt(0)}
                                                                    </div>
                                                                    
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <h5 className={`font-bold text-lg truncate pr-4 ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                                                                                {p.name}
                                                                            </h5>
                                                                            {isSelected && (
                                                                                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                                    Selected
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${isSelected ? 'bg-white border-purple-200 text-purple-700' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                                                                                <FontAwesomeIcon icon={faUser} className="text-xs opacity-70" /> {p.parent_role || 'Parent'}
                                                                            </span>
                                                                            <span className="inline-flex items-center gap-1.5">
                                                                                <FontAwesomeIcon icon={faPhone} className="text-xs opacity-70" /> {p.phone}
                                                                            </span>
                                                                        </div>
                                                                        {p.email && (
                                                                             <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                                                                                 <FontAwesomeIcon icon={faEnvelope} /> {p.email}
                                                                             </div>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className={`self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`}>
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                                                            <FontAwesomeIcon icon={isSelected ? faCheck : faArrowRight} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Decorative highlight on hover */}
                                                                {!isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>}
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    {localParents.filter(p => 
                                                        p.name.toLowerCase().includes(parentSearchQuery.toLowerCase()) || 
                                                        p.phone.toString().includes(parentSearchQuery) ||
                                                        (p.email && p.email.toLowerCase().includes(parentSearchQuery.toLowerCase()))
                                                    ).length === 0 && (
                                                        <div className="text-center py-16 px-6">
                                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                                <FontAwesomeIcon icon={faSearch} className="text-2xl" />
                                                            </div>
                                                            <h5 className="text-gray-900 font-bold text-lg mb-1">No parents found</h5>
                                                            <p className="text-gray-500 text-sm">We couldn't find any parents matching "{parentSearchQuery}".</p>
                                                            <button 
                                                                onClick={() => { setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                                className="mt-6 text-purple-600 font-bold hover:underline"
                                                            >
                                                                Create a new parent instead?
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-200 bg-white/90 backdrop-blur-md flex-shrink-0 z-20">
                    <button
                        onClick={handleSaveStudent}
                        className="w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all text-base flex items-center justify-center gap-3"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        <span>Confirm & Create Student Profile</span>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><FontAwesomeIcon icon={faCheck} className="text-sm" /></div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddStudentForm;
