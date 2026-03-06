import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faBus, 
    faCheck, 
    faMagic, 
    faHashtag, 
    faTruck, 
    faTrademark, 
    faCarSide, 
    faChair, 
    faInfoCircle, 
    faUser, 
    faRoute, 
    faCalendarAlt, 
    faLink,
    faChevronDown,
    faCogs,
    faShieldAlt,
    faClipboardList,
    faCircleNotch,
    faFilePdf,
    faFileUpload
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, error }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none disabled:text-slate-400"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon, value, onChange, options, placeholder, disabled = false, error, activeColor = 'blue' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value == value);

    const colorConfig = {
        blue: { primary: 'blue-600', light: 'bg-blue-50', border: 'hover:border-blue-400', ring: 'ring-blue-500' },
        indigo: { primary: 'indigo-600', light: 'bg-indigo-50', border: 'hover:border-indigo-400', ring: 'ring-indigo-500' },
        emerald: { primary: 'emerald-600', light: 'bg-emerald-50', border: 'hover:border-emerald-400', ring: 'ring-emerald-500' },
        amber: { primary: 'amber-600', light: 'bg-amber-50', border: 'hover:border-amber-400', ring: 'ring-amber-500' }
    };
    const theme = colorConfig[activeColor] || colorConfig.blue;

    return (
        <div className={`relative group/field ${isOpen ? 'z-[3000]' : 'z-10'}`} ref={containerRef}>
            <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
                {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
            </div>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between bg-white rounded-2xl border ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : `cursor-pointer ${theme.border} hover:shadow-md`} transition-all duration-300 px-4 py-3 ${isOpen ? `ring-4 ${theme.ring}/10 border-${theme.primary.split('-')[0]}-500 shadow-lg` : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedOption ? `bg-${theme.primary} text-white shadow-sm` : error ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'}`}>
                        <FontAwesomeIcon icon={icon} className="text-xs" />
                    </div>
                    {selectedOption ? (
                        <span className="text-[13px] font-bold text-slate-800">{selectedOption.label}</span>
                    ) : (
                        <span className="text-[13px] font-bold text-slate-400">{placeholder}</span>
                    )}
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-[3001] max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                        {options.map((opt, idx) => (
                            <div 
                                key={idx}
                                onClick={() => { onChange({ target: { value: opt.value } }); setIsOpen(false); }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${value == opt.value ? `bg-${theme.primary} text-white shadow-sm` : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value == opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <FontAwesomeIcon icon={icon} />
                                </div>
                                <span className={`text-[12px] font-bold truncate flex-1 ${value == opt.value ? 'text-white' : 'text-slate-800'}`}>{opt.label}</span>
                                {value == opt.value && (
                                    <FontAwesomeIcon icon={faCheck} className="text-[10px] shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FileUploadField = ({ label, icon, onFileSelect, fileName, disabled = false, error }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 min-h-[52px] ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg focus-within:ring-4 focus-within:ring-blue-500/10'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div className="flex-1 pl-12 pr-4 py-3 flex items-center justify-between overflow-hidden">
                <span className={`text-[13px] font-bold truncate ${fileName ? 'text-slate-700' : 'text-slate-300'}`}>
                    {fileName || "No file chosen"}
                </span>
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shrink-0 ml-2">
                    {fileName ? 'Change' : 'Upload'}
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            // Check file size (2MB limit)
                            const maxSize = 2 * 1024 * 1024; // 2MB
                            if (file.size > maxSize) {
                                alert("File is too large. Please select a document smaller than 2MB.");
                                e.target.value = ''; // Reset input
                                return;
                            }

                            onFileSelect(file);
                        }}
                        disabled={disabled}
                        accept=".pdf,.jpg,.jpeg,.png"
                    />
                </label>
            </div>
        </div>
    </div>
);

const AddBusForm = ({ show, onClose, onAdd, onUpdate, editingBus, drivers = [], routes = [] }) => {
    const [busData, setBusData] = useState({ 
        registration_number: '', 
        bus_name: '',
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

    const [rcFile, setRcFile] = useState(null);
    const [fcFile, setFcFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show && editingBus) {
            setBusData({
                ...editingBus,
                seating_capacity: editingBus.seating_capacity || editingBus.capacity || '',
                registration_number: editingBus.registration_number || editingBus.busNumber || ''
            });
            setRcFile(null);
            setFcFile(null);
        } else if (show && !editingBus) {
            setBusData({ 
                registration_number: '', 
                bus_name: '',
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
            setRcFile(null);
            setFcFile(null);
        }
    }, [show, editingBus]);

    const [touched, setTouched] = useState({});

    const isValid = busData.registration_number && busData.bus_name && busData.vehicle_type;

    const handleAutoFill = () => {
        const brand = ['Tata', 'Ashok Leyland', 'Eicher', 'Force'][Math.floor(Math.random() * 4)];
        const model = ['Starbus', 'Viking', 'Pro 3000', 'Traveller'][Math.floor(Math.random() * 4)];
        setBusData({
            registration_number: `TN${Math.floor(Math.random() * 90) + 10}AB${Math.floor(Math.random() * 9000) + 1000}`,
            bus_name: `${brand} ${model} - ${Math.floor(Math.random() * 100)}`,
            vehicle_type: ['School Bus', 'Mini', 'Van'][Math.floor(Math.random() * 3)],
            bus_brand: brand,
            bus_model: model,
            seating_capacity: Math.floor(Math.random() * 30) + 20,
            status: ['Active', 'Maintenance', 'Inactive'][Math.floor(Math.random() * 3)],
            driver_id: drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)].driver_id : '',
            route_id: routes.length > 0 ? routes[Math.floor(Math.random() * routes.length)].route_id : '',
            rc_expiry_date: new Date(Date.now() + Math.random() * 31536000000).toISOString().split('T')[0],
            fc_expiry_date: new Date(Date.now() + Math.random() * 15768000000).toISOString().split('T')[0],
            rc_book_url: 'https://example.com/rc_book.pdf',
            fc_certificate_url: 'https://example.com/fc_cert.pdf'
        });
        setTouched({ registration_number: true, bus_name: true, vehicle_type: true });
    };

    const handleSubmit = async () => {
        setTouched({ registration_number: true, bus_name: true, vehicle_type: true });
        if (isValid) {
            setIsSubmitting(true);
            try {
                const files = { rcFile, fcFile };
                if (editingBus) {
                    await onUpdate({ ...editingBus, ...busData }, files);
                } else {
                    await onAdd(busData, files);
                }
                onClose();
            } catch (error) {
                console.error("Failed to process bus data:", error);
                alert("Operation failed. Please check registry protocols.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleClose = () => {
        setBusData({ 
            registration_number: '', 
            bus_name: '',
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
        setRcFile(null);
        setFcFile(null);
        setTouched({});
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[99999] transition-opacity duration-300" onClick={handleClose} />
            
            <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-50 shadow-2xl z-[100000] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                
                {/* Static Action Buttons (Close / Auto Pilot) */}
                <div className="absolute top-6 right-8 z-[100010] flex items-center gap-3">
                    <button 
                        onClick={handleAutoFill}
                        className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-blue-600 hover:text-white hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-90"
                        title="Auto Pilot"
                    >
                        <FontAwesomeIcon icon={faMagic} className="text-lg" />
                    </button>
                    <button 
                        onClick={handleClose} 
                        className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Header Substrate - Now Sticky */}
                <div className="sticky top-0 px-8 py-7 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center z-30 border-b border-slate-100/50">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-700"></div>
                            <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_10px_25px_rgba(58,123,255,0.25)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                <FontAwesomeIcon icon={faBus} className="text-lg" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5">{editingBus ? 'Update Details' : 'Add New Bus'}</h3>
                        </div>
                    </div>
                </div>

                {/* Form Environment */}
                <div className="flex-1 overflow-y-auto px-3 lg:px-8 pb-48 lg:pb-32 space-y-6 lg:space-y-8 custom-scrollbar">
                    
                    {/* Vehicle Specifications Bento */}
                    <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faClipboardList} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Bus Info</h4>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <InputField 
                                    label="Bus Number" 
                                    icon={faHashtag} 
                                    value={busData.registration_number} 
                                    onChange={(e) => setBusData({...busData, registration_number: e.target.value})} 
                                    placeholder="TNXXABXXXX" 
                                    error={touched.registration_number && !busData.registration_number}
                                />
                                <InputField 
                                    label="Bus Name" 
                                    icon={faBus} 
                                    value={busData.bus_name} 
                                    onChange={(e) => setBusData({...busData, bus_name: e.target.value})} 
                                    placeholder="e.g. ALPHA-01" 
                                    error={touched.bus_name && !busData.bus_name}
                                />
                            </div>

                            <SelectField 
                                label="Type" 
                                icon={faTruck} 
                                value={busData.vehicle_type} 
                                onChange={(e) => setBusData({...busData, vehicle_type: e.target.value})} 
                                placeholder="Select Category"
                                options={[
                                    { value: 'School Bus', label: 'School Bus' },
                                    { value: 'Mini', label: 'Mini Bus' },
                                    { value: 'Van', label: 'Utility Van' }
                                ]} 
                            />

                            <div className="grid grid-cols-2 gap-5">
                                <InputField label="Brand" icon={faTrademark} value={busData.bus_brand} onChange={(e) => setBusData({...busData, bus_brand: e.target.value})} placeholder="Tata / AL" />
                                <InputField label="Model" icon={faCarSide} value={busData.bus_model} onChange={(e) => setBusData({...busData, bus_model: e.target.value})} placeholder="Viking / Starbus" />
                            </div>
                        </div>
                    </div>

                    {/* Fleet Layout Bento */}
                    <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faCogs} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Seats & Status</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <InputField label="Seats" icon={faChair} type="number" value={busData.seating_capacity} onChange={(e) => setBusData({...busData, seating_capacity: e.target.value})} placeholder="40" />
                            <SelectField 
                                label="Status" 
                                icon={faInfoCircle} 
                                value={busData.status} 
                                onChange={(e) => setBusData({...busData, status: e.target.value})} 
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Maintenance', label: 'Maintenance' },
                                    { value: 'Inactive', label: 'Inactive' }
                                ]} 
                            />
                        </div>
                    </div>

                    {/* Operational Assignment Bento */}
                    <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faRoute} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Driver & Route</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <SelectField 
                                label="Driver" 
                                icon={faUser} 
                                value={busData.driver_id} 
                                onChange={(e) => setBusData({...busData, driver_id: e.target.value})} 
                                placeholder="Select Driver"
                                activeColor="amber"
                                options={drivers
                                    .filter(d => {
                                        const status = (d.status || d.active_status || '').toUpperCase();
                                        return status === 'ACTIVE' || d.driver_id === busData.driver_id;
                                    })
                                    .map(d => ({ value: d.driver_id, label: d.name }))} 
                            />
                            <SelectField 
                                label="Route" 
                                icon={faRoute} 
                                value={busData.route_id} 
                                onChange={(e) => setBusData({...busData, route_id: e.target.value})} 
                                placeholder="Select Route"
                                activeColor="indigo"
                                options={routes
                                    .filter(r => {
                                        const status = (r.status || r.active_status || r.routes_active_status || '').toUpperCase();
                                        return status === 'ACTIVE' || r.route_id === busData.route_id;
                                    })
                                    .map(r => ({ value: r.route_id, label: r.name }))} 
                            />
                        </div>
                    </div>

                    {/* Compliance Assets Bento */}
                    <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Documents</h4>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <InputField label="RC Expiry" icon={faCalendarAlt} type="date" value={busData.rc_expiry_date} onChange={(e) => setBusData({...busData, rc_expiry_date: e.target.value})} />
                                <InputField label="FC Expiry" icon={faCalendarAlt} type="date" value={busData.fc_expiry_date} onChange={(e) => setBusData({...busData, fc_expiry_date: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <FileUploadField 
                                    label="RC Book (PDF/JPG)" 
                                    icon={faFilePdf} 
                                    onFileSelect={setRcFile} 
                                    fileName={rcFile?.name || (busData.rc_book_url ? "Current RC Book" : "")} 
                                />
                                <FileUploadField 
                                    label="FC Certificate (PDF/JPG)" 
                                    icon={faShieldAlt} 
                                    onFileSelect={setFcFile} 
                                    fileName={fcFile?.name || (busData.fc_certificate_url ? "Current FC Certificate" : "")} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Execution Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleSubmit}
                        disabled={(!isValid && Object.keys(touched).length > 0) || isSubmitting}
                        className={`group w-full h-12 lg:h-14 rounded-xl lg:rounded-2xl font-black text-white text-[8px] lg:text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 lg:gap-4 transition-all shadow-2xl active:scale-95 ${(!isValid && Object.keys(touched).length > 0) || isSubmitting ? 'bg-slate-400 opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-blue-500/25 active:scale-95'}`}
                        style={{ 
                            background: (isValid || Object.keys(touched).length === 0) && !isSubmitting
                                ? 'linear-gradient(135deg, #3A7BFF 0%, #1e3a8a 100%)' 
                                : '' 
                        }}
                    >
                        <span>{isSubmitting ? 'Processing...' : (editingBus ? 'Update Details' : 'Add Bus')}</span>
                        <div className={`w-9 h-9 ${isSubmitting ? '' : 'bg-white/10'} rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                            {isSubmitting ? (
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-xs" />
                            ) : (
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddBusForm;
