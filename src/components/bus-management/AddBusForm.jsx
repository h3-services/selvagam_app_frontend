import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBus, faCheck, faMagic, faExclamationCircle, faHashtag, faTruck, faTrademark, faCarSide, faChair, faInfoCircle, faUser, faRoute, faCalendarAlt, faLink } from '@fortawesome/free-solid-svg-icons';

const InputField = ({ label, icon, type = "text", placeholder, value, onChange, className = "", error, errorMessage }) => {
    let borderColor = "border-gray-100";
    let focusColor = "focus:border-blue-400 focus:ring-blue-50";
    let iconColor = "bg-gray-100 text-gray-500";
    let textColor = "text-gray-700";

    if (error) {
        borderColor = "border-red-500";
        focusColor = "focus:border-red-500 focus:ring-red-50";
        iconColor = "bg-red-50 text-red-500";
        textColor = "text-red-600";
    }

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-2">
                <label className={`block text-xs font-bold uppercase tracking-wide ${error ? 'text-red-500' : 'text-gray-700'}`}>
                    {label}
                </label>
                {error && <span className="text-xs text-red-500 font-medium flex items-center gap-1"><FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage || "Required"}</span>}
            </div>
            <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${iconColor}`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full bg-white border-2 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:outline-none transition-all shadow-sm font-medium placeholder-gray-400 focus:ring-4 ${borderColor} ${focusColor} ${textColor}`}
                />
            </div>
        </div>
    );
};

const SelectField = ({ label, icon, value, onChange, options, className = "", placeholder = "Select..." }) => {
    return (
        <div className={className}>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full bg-white border-2 border-gray-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all shadow-sm font-medium text-gray-700 appearance-none"
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    );
};

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

    const [touched, setTouched] = useState({});

    // Simple validation (can be expanded)
    const isValid = newBus.registration_number && newBus.vehicle_type;

    const generateRandomBus = () => {
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
        setTouched({ registration_number: true, vehicle_type: true });
    };

    const handleAdd = () => {
        setTouched({ registration_number: true, vehicle_type: true });
        if (isValid) {
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
            setTouched({});
        }
    };

    const handleClose = () => {
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
        setTouched({});
        onClose();
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1500]" onClick={handleClose}></div>
            <div className="fixed right-0 top-0 h-full w-full md:w-[800px] bg-white shadow-2xl z-[1501] flex flex-col animate-slide-in">
                {/* Header */}
                <div className="relative px-8 py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex-shrink-0 z-10 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                       <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 rounded-full"></div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center shadow-xl relative z-10 text-white">
                                <FontAwesomeIcon icon={faBus} className="text-lg" />
                            </div>
                       </div>
                        <div>
                            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Add New Bus</h3>
                            <p className="text-gray-500 text-sm font-medium">Enter detailed bus vehicle information</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={generateRandomBus}
                            className="h-10 px-4 rounded-full bg-blue-50 hover:bg-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs gap-2 transition-colors duration-200"
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

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="space-y-8">
                        
                        {/* Vehicle Information */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Vehicle Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField 
                                    label="Reg. Number" 
                                    icon={faHashtag} 
                                    value={newBus.registration_number}
                                    onChange={(e) => setNewBus({ ...newBus, registration_number: e.target.value })}
                                    placeholder="TN01AB1234"
                                    error={touched.registration_number && !newBus.registration_number}
                                    errorMessage="Reg. No is required"
                                />
                                <SelectField 
                                    label="Vehicle Type" 
                                    icon={faTruck}
                                    value={newBus.vehicle_type}
                                    onChange={(e) => setNewBus({ ...newBus, vehicle_type: e.target.value })}
                                    options={[
                                        { value: 'School Bus', label: 'School Bus' },
                                        { value: 'Mini', label: 'Mini Bus' },
                                        { value: 'Van', label: 'Van' }
                                    ]}
                                />
                                <InputField 
                                    label="Brand" 
                                    icon={faTrademark} 
                                    value={newBus.bus_brand}
                                    onChange={(e) => setNewBus({ ...newBus, bus_brand: e.target.value })}
                                    placeholder="e.g. Tata, Ashok Leyland"
                                />
                                <InputField 
                                    label="Model" 
                                    icon={faCarSide} 
                                    value={newBus.bus_model}
                                    onChange={(e) => setNewBus({ ...newBus, bus_model: e.target.value })}
                                    placeholder="e.g. Starbus"
                                />
                            </div>
                        </div>

                        {/* Status & Capacity */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Configuration
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField 
                                    label="Seating Capacity" 
                                    icon={faChair} 
                                    type="number"
                                    value={newBus.seating_capacity}
                                    onChange={(e) => setNewBus({ ...newBus, seating_capacity: e.target.value })}
                                    placeholder="40"
                                />
                                <SelectField 
                                    label="Status" 
                                    icon={faInfoCircle}
                                    value={newBus.status}
                                    onChange={(e) => setNewBus({ ...newBus, status: e.target.value })}
                                    options={[
                                        { value: 'Active', label: 'Active' },
                                        { value: 'Maintenance', label: 'Maintenance' },
                                        { value: 'Inactive', label: 'Inactive' }
                                    ]}
                                />
                            </div>
                        </div>

                         {/* Assignment */}
                         <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Operations
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <SelectField 
                                    label="Assign Driver" 
                                    icon={faUser}
                                    value={newBus.driver_id}
                                    onChange={(e) => setNewBus({ ...newBus, driver_id: e.target.value })}
                                    options={drivers.map(d => ({ value: d.driver_id, label: d.name }))}
                                    placeholder="Select Driver (Optional)"
                                />
                                <SelectField 
                                    label="Assign Route" 
                                    icon={faRoute}
                                    value={newBus.route_id}
                                    onChange={(e) => setNewBus({ ...newBus, route_id: e.target.value })}
                                    options={routes.map(r => ({ value: r.route_id, label: r.name }))}
                                    placeholder="Select Route (Optional)"
                                />
                            </div>
                        </div>

                        {/* Documents & Expiry */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                Documents & Compliance
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InputField 
                                    label="RC Expiry Date" 
                                    icon={faCalendarAlt} 
                                    type="date"
                                    value={newBus.rc_expiry_date}
                                    onChange={(e) => setNewBus({ ...newBus, rc_expiry_date: e.target.value })}
                                />
                                <InputField 
                                    label="FC Expiry Date" 
                                    icon={faCalendarAlt} 
                                    type="date"
                                    value={newBus.fc_expiry_date}
                                    onChange={(e) => setNewBus({ ...newBus, fc_expiry_date: e.target.value })}
                                />
                                <InputField 
                                    label="RC Book URL" 
                                    icon={faLink} 
                                    value={newBus.rc_book_url}
                                    onChange={(e) => setNewBus({ ...newBus, rc_book_url: e.target.value })}
                                    placeholder="https://..."
                                />
                                <InputField 
                                    label="FC Certificate URL" 
                                    icon={faLink} 
                                    value={newBus.fc_certificate_url}
                                    onChange={(e) => setNewBus({ ...newBus, fc_certificate_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-200 bg-white/90 backdrop-blur-md flex-shrink-0 z-20">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-purple-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all text-base flex items-center justify-center gap-3 ${
                            !isValid
                                ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:shadow-xl hover:scale-[1.01]'
                        }`}
                        disabled={!isValid}
                    >
                        <span>Add Vehicle</span>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><FontAwesomeIcon icon={faCheck} className="text-sm" /></div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddBusForm;
