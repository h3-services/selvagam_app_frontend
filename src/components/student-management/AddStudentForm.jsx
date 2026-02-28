import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faPhone, faChild, faCheck, faUserTie, faCalendar, faSchool, faBus, faMapMarkerAlt, faImage, faWarning, faHome, faEnvelope, faLock, faArrowRight, faSearch, faChevronDown, faMagic, faCircleNotch, faFileUpload, faRoute, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import { routeService } from '../../services/routeService';
import { parentService } from '../../services/parentService';
import { classService } from '../../services/classService';
import AddClassForm from '../class-management/AddClassForm';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, error, maxLength }) => (
    <div className="relative group/field">
        <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
            {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
        </div>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className={`w-12 h-12 flex items-center justify-center absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:scale-110 ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within/field:text-blue-600'}`}>
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                maxLength={maxLength}
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none disabled:text-slate-400"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon, value, onChange, options, placeholder, disabled = false, error, onAdd, addLabel }) => (
    <div className="relative group/field">
        <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
            {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
        </div>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className={`w-12 h-12 flex items-center justify-center absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:scale-110 ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within/field:text-blue-600'}`}>
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-12 pr-10 py-4 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 focus:outline-none appearance-none disabled:text-slate-400 cursor-pointer"
            >
                {placeholder && <option value="" disabled hidden={Boolean(value)}>{placeholder}</option>}
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
        {onAdd && (
            <button
                type="button"
                onClick={onAdd}
                className="w-full mt-2 px-3 py-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-[11px] font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
            >
                <span className="text-lg leading-none">+</span> {addLabel || 'Add New'}
            </button>
        )}
    </div>
);

const YearRangePicker = ({ label, start, end, onStartChange, onEndChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 31}, (_, i) => (currentYear + i - 15).toString());
    
    return (
        <div className="relative group/field">
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <div className="flex-1 relative group/start">
                    <select 
                        value={start} 
                        onChange={(e) => onStartChange(e.target.value)}
                        className="w-full h-11 bg-white rounded-xl text-center text-[13px] font-black text-blue-600 shadow-sm appearance-none cursor-pointer hover:bg-blue-50 transition-all border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="flex-shrink-0 w-4 font-black text-slate-300 text-[10px] flex justify-center">TO</div>
                <div className="flex-1 relative group/end">
                    <select 
                        value={end} 
                        onChange={(e) => onEndChange(e.target.value)}
                        className="w-full h-11 bg-white rounded-xl text-center text-[13px] font-black text-blue-600 shadow-sm appearance-none cursor-pointer hover:bg-blue-50 transition-all border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

const FileUploadField = ({ label, icon, onFileSelect, fileName, error, onError }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center justify-between bg-slate-50 rounded-2xl border-2 border-dashed transition-all duration-300 p-4 ${error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${fileName ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
                    <FontAwesomeIcon icon={fileName ? faCheck : icon} className="text-sm" />
                </div>
                <div>
                    <div className="text-[13px] font-black text-slate-700 truncate max-w-[180px]">
                        {fileName || "Click to upload student photo"}
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {fileName ? "Photo selected successfully" : "Suggested size: 800x800px"}
                    </p>
                </div>
            </div>
            <label className="cursor-pointer">
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // Check file size (2MB limit)
                        const maxSize = 2 * 1024 * 1024; // 2MB
                        if (file.size > maxSize) {
                            if (onError) onError("File is too large. Please select a photo smaller than 2MB.");
                            e.target.value = ''; // Reset input
                            return;
                        }

                        // Check if it's an image
                        if (!file.type.startsWith('image/')) {
                            if (onError) onError("Invalid file type. Please select an image (JPG/PNG).");
                            e.target.value = ''; // Reset input
                            return;
                        }

                        onFileSelect(file);
                    }} 
                />
                <div className="flex flex-col items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-sm group-hover/field:shadow-md">
                    <FontAwesomeIcon icon={faFileUpload} className="text-xs" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Select</span>
                </div>
            </label>
        </div>
        {error && <p className="mt-1.5 ml-1 text-[9px] font-bold text-rose-500 uppercase tracking-wider">{error}</p>}
    </div>
);

const ClassSelector = ({ label, value, options, onChange, placeholder, error, onAddClass }) => {
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

    return (
        <div className={`relative group/field ${isOpen ? 'z-[3000]' : 'z-10'}`} ref={containerRef}>
            <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
                {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
            </div>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between bg-white rounded-2xl border cursor-pointer transition-all duration-300 px-4 py-3 ${isOpen ? 'ring-4 ring-blue-500/10 border-blue-500 shadow-lg' : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200 hover:border-blue-400 hover:shadow-md'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedOption ? 'bg-blue-600 text-white shadow-sm' : error ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'}`}>
                        <FontAwesomeIcon icon={faSchool} className="text-xs" />
                    </div>
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-800">Class {selectedOption.className}</span>
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">Sec {selectedOption.section}</span>
                        </div>
                    ) : (
                        <span className="text-[13px] font-bold text-slate-400">{placeholder}</span>
                    )}
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-[3001] max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-1">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 ${value == opt.value ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value == opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {opt.className}
                                </div>
                                <div className="flex flex-col leading-none min-w-0">
                                    <span className={`text-[11px] font-bold truncate ${value == opt.value ? 'text-white' : 'text-slate-800'}`}>Class {opt.className}</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${value == opt.value ? 'text-blue-200' : 'text-slate-400'}`}>Sec {opt.section}</span>
                                </div>
                                {value == opt.value && (
                                    <FontAwesomeIcon icon={faCheck} className="text-[8px] ml-auto shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Add Class Button */}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onAddClass && onAddClass(); }}
                        className="w-full mt-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-[11px] font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-lg leading-none">+</span> Add New Class
                    </button>
                </div>
            )}
        </div>
    );
};

const RouteSelector = ({ label, value, options, onChange, placeholder, error, onAdd, addLabel, disabled }) => {
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

    return (
        <div className={`relative group/field ${isOpen ? 'z-[3000]' : 'z-10'}`} ref={containerRef}>
            <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
                {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
            </div>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between bg-white rounded-2xl border ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-indigo-400 hover:shadow-md'} transition-all duration-300 px-4 py-3 ${isOpen ? 'ring-4 ring-indigo-500/10 border-indigo-500 shadow-lg' : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedOption ? 'bg-indigo-600 text-white shadow-sm' : error ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'}`}>
                        <FontAwesomeIcon icon={faBus} className="text-xs" />
                    </div>
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-800">{selectedOption.label}</span>
                        </div>
                    ) : (
                        <span className="text-[13px] font-bold text-slate-400">{placeholder}</span>
                    )}
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-[3001] max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${value == opt.value ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value == opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <FontAwesomeIcon icon={faRoute} />
                                </div>
                                <span className={`text-[12px] font-bold truncate flex-1 ${value == opt.value ? 'text-white' : 'text-slate-800'}`}>{opt.label}</span>
                                {value == opt.value && (
                                    <FontAwesomeIcon icon={faCheck} className="text-[10px] shrink-0" />
                                )}
                            </div>
                        ))}
                        {options.length === 0 && (
                            <div className="px-3 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">No routes found</div>
                        )}
                    </div>
                    {onAdd && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onAdd(); }}
                            className="w-full mt-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-[11px] font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="text-lg leading-none">+</span> {addLabel || 'Add New'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const StopSelector = ({ label, value, options, onChange, placeholder, error, disabled, icon = faMapMarkerAlt, activeColor = 'teal' }) => {
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
    
    // Determine color classes based on activeColor prop
    const colorMap = {
        teal: { bg: 'bg-teal-600', text: 'text-teal-600', lightBg: 'bg-teal-50', hoverBorder: 'hover:border-teal-400', ring: 'ring-teal-500' },
        orange: { bg: 'bg-orange-600', text: 'text-orange-600', lightBg: 'bg-orange-50', hoverBorder: 'hover:border-orange-400', ring: 'ring-orange-500' },
    };
    const colors = colorMap[activeColor] || colorMap.teal;

    return (
        <div className={`relative group/field ${isOpen ? 'z-[3000]' : 'z-10'}`} ref={containerRef}>
            <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
                {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
            </div>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between bg-white rounded-2xl border ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : `cursor-pointer ${colors.hoverBorder} hover:shadow-md`} transition-all duration-300 px-4 py-3 ${isOpen ? `ring-4 ${colors.ring}/10 border-${colors.ring.split('-')[1]}-500 shadow-lg` : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedOption ? `${colors.bg} text-white shadow-sm` : error ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'}`}>
                        <FontAwesomeIcon icon={icon} className="text-xs" />
                    </div>
                    {selectedOption ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-800">{selectedOption.name}</span>
                            <span className={`text-[9px] font-black ${colors.text} ${colors.lightBg} px-2 py-0.5 rounded-md border border-${colors.text.split('-')[1]}-100 uppercase tracking-wider`}>Stop {selectedOption.order}</span>
                        </div>
                    ) : (
                        <span className="text-[13px] font-bold text-slate-400">{placeholder}</span>
                    )}
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-[3001] max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 gap-1">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${value == opt.value ? `${colors.bg} text-white shadow-sm` : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value == opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {opt.order}
                                </div>
                                <span className={`text-[12px] font-bold truncate flex-1 ${value == opt.value ? 'text-white' : 'text-slate-800'}`}>{opt.name}</span>
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

const STORAGE_KEY = 'addStudentFormDefaults';

const getSavedDefaults = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
};

const AddStudentForm = ({ show, onClose, onAdd, onUpdate, parents, initialData, preloadedClasses, preloadedRoutes, preloadedStops }) => {
    const saved = getSavedDefaults();
    
    const defaultStudentState = {
        name: '',
        parent_id: '',
        s_parent_id: '',
        dob: saved.dobYear ? `${saved.dobYear}-01-01` : '',
        class_id: saved.class_id || '',
        pickup_route_id: '',
        drop_route_id: '',
        pickup_stop_id: '',
        drop_stop_id: '',
        emergency_contact: '',
        student_photo_url: '',
        study_year: '',
        yearStart: saved.yearStart || new Date().getFullYear().toString(),
        yearEnd: saved.yearEnd || (new Date().getFullYear() + 1).toString(),
        is_transport_user: true,
        gender: saved.gender || 'MALE'
    };

    const defaultParentState = {
        name: '',
        phone: '',
        email: '',
        parent_role: 'MOTHER', // Default per schema
        door_no: '',
        street: '',
        city: '',
        district: '',
        pincode: ''
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
    const [showAddClassForm, setShowAddClassForm] = useState(false);
    const [filteredPickupStops, setFilteredPickupStops] = useState([]);
    const [filteredDropStops, setFilteredDropStops] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [loadingParent, setLoadingParent] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    useEffect(() => {
        if (parents) {
            setLocalParents(parents);
        }
    }, [parents]);

    useEffect(() => {
        if (initialData) {
            console.log("Loading Initial Data for Edit:", initialData);
            const d = initialData;
            
            // Extract years from study_year (Format: "2024-2025")
            let yStart = new Date().getFullYear().toString();
            let yEnd = (new Date().getFullYear() + 1).toString();
            
            if (d.study_year && d.study_year.includes('-')) {
                const parts = d.study_year.split('-');
                yStart = parts[0];
                yEnd = parts[1]; 
            }

            setFormData({
                name: d.name || '',
                parent_id: d.parent_id || '',
                s_parent_id: d.s_parent_id || '',
                dob: d.dob || '',
                class_id: d.class_id || '',
                pickup_route_id: d.pickup_route_id || '',
                drop_route_id: d.drop_route_id || '',
                pickup_stop_id: d.pickup_stop_id || '',
                drop_stop_id: d.drop_stop_id || '',
                emergency_contact: d.emergency_contact || '',
                student_photo_url: d.student_photo_url || '',
                study_year: d.study_year || '',
                yearStart: yStart,
                yearEnd: yEnd,
                is_transport_user: d.is_transport_user !== undefined ? d.is_transport_user : true,
                gender: d.gender || 'MALE'
            });
        } else {
            setFormData(defaultStudentState);
        }
    }, [initialData, show]);

    // Use preloaded data from parent, fetch only if not available
    useEffect(() => {
        if (show) {
            if (preloadedClasses?.length) setClasses(preloadedClasses);
            if (preloadedRoutes?.length) setRoutes(preloadedRoutes);
            if (preloadedStops?.length) setStops(preloadedStops);
            
            // Only fetch if preloaded data is missing
            if (!preloadedClasses?.length || !preloadedRoutes?.length || !preloadedStops?.length) {
                fetchRoutesAndStops();
            }
        }
    }, [show, preloadedClasses, preloadedRoutes, preloadedStops]);

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

    // Save defaults to localStorage when key fields change
    const saveDefaults = (field, value) => {
        try {
            const current = getSavedDefaults();
            if (field === 'gender') current.gender = value;
            if (field === 'yearStart') current.yearStart = value;
            if (field === 'yearEnd') current.yearEnd = value;
            if (field === 'class_id') current.class_id = value;
            if (field === 'dob' && value) current.dobYear = value.split('-')[0];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        } catch (e) { console.warn('Could not save form defaults', e); }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Persist key fields
        if (['gender', 'yearStart', 'yearEnd', 'class_id', 'dob'].includes(field)) {
            saveDefaults(field, value);
        }
    };

    const handleParentChange = (field, value) => {
        setNewParent(prev => ({ ...prev, [field]: value }));
    };

    const validateParent = () => {
        const newErrors = {};
        if (!newParent.name) newErrors.parentName = "Name Required";
        if (!newParent.phone) {
            newErrors.parentPhone = "Phone Required";
        } else if (!/^\d{10}$/.test(newParent.phone)) {
            newErrors.parentPhone = "Must be 10 digits";
        }
        if (!newParent.parent_role) newErrors.parentRole = "Role Required";
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateParent = async () => {
        if (!validateParent()) return;
        
        setLoadingParent(true);
        try {
            // API expects phone as a Number based on Swagger example
            const payload = {
                name: newParent.name,
                phone: Number(newParent.phone) || 0,
                email: newParent.email || '',
                parent_role: newParent.parent_role,
                door_no: String(newParent.door_no || ''),
                street: newParent.street || '',
                city: newParent.city || '',
                district: newParent.district || '',
                pincode: String(newParent.pincode || ''),
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
            
            let errorMessage = "Failed to create parent. Please check inputs.";
            if (error.response?.data) {
                const apiError = error.response.data;
                if (apiError.message) {
                    errorMessage = apiError.message;
                } else if (apiError.detail) {
                    errorMessage = typeof apiError.detail === 'string' ? apiError.detail : JSON.stringify(apiError.detail);
                }
            }
            setErrors(prev => ({ ...prev, apiError: errorMessage }));
        } finally {
            setLoadingParent(false);
        }
    };

    const validateStudent = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Required";
        if (!formData.parent_id) newErrors.parent_id = "Required";
        if (!formData.dob) newErrors.dob = "Required";
        if (!formData.class_id) newErrors.class_id = "Required";
        
        if (formData.emergency_contact && !/^\d{10}$/.test(formData.emergency_contact)) {
            newErrors.emergency_contact = "10 Digits Only";
        }

        if (formData.s_parent_id && formData.parent_id === formData.s_parent_id) {
            newErrors.s_parent_id = "Cannot be same as primary";
        }

        if (formData.is_transport_user) {
            if (!formData.pickup_route_id) newErrors.pickup_route_id = "Required";
            if (!formData.pickup_stop_id) newErrors.pickup_stop_id = "Required";
            if (!formData.drop_route_id) newErrors.drop_route_id = "Required";
            if (!formData.drop_stop_id) newErrors.drop_stop_id = "Required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveStudent = async () => {
        if (!validateStudent()) return;

        setLoadingSave(true);
        try {
            const combinedStudyYear = formData.yearStart && formData.yearEnd ? `${formData.yearStart}-${formData.yearEnd}` : '';

            // Build payload matching the working Swagger example exactly
            const payload = {
                name: formData.name,
                parent_id: formData.parent_id,
                dob: formData.dob,
                gender: formData.gender || 'MALE',
                s_parent_id: formData.s_parent_id || null, 
                is_transport_user: formData.is_transport_user,
                study_year: combinedStudyYear,
                emergency_contact: formData.emergency_contact ? Number(formData.emergency_contact) : 0
            };

            // Add optional fields only if they have actual values
            if (formData.class_id) payload.class_id = formData.class_id;
            
            // Only include transport details if transport user is true
            if (formData.is_transport_user) {
                payload.pickup_route_id = formData.pickup_route_id;
                payload.drop_route_id = formData.drop_route_id;
                payload.pickup_stop_id = formData.pickup_stop_id;
                payload.drop_stop_id = formData.drop_stop_id;
            }

            if (formData.student_photo_url) payload.student_photo_url = formData.student_photo_url;

            console.log("Saving Student Payload:", JSON.stringify(payload, null, 2));
            
            if (initialData) {
                await onUpdate(initialData.student_id, payload, { photoFile });
            } else {
                await onAdd(payload, { photoFile });
            }
            
            setFormData(defaultStudentState);
            setIsAddingNewParent(false);
            setIsSearchingParent(false);
        } catch (error) {
            console.error("Save Student Error:", error);
            // Error handling is mostly done in parent via alert, 
            // but we need to stop loading here if use stays on form
        } finally {
            setLoadingSave(false);
        }
    };



    const handleAutoFill = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const dummyStudent = {
            name: `Student ${randomNum}`,
            dob: "2016-08-15",
            gender: "MALE",
            blood_group: "O+",
            // Use first active class from the fetched list
            class_id: classes.find(c => c.status === 'ACTIVE')?.class_id || "", 
            section: "A",
            roll_no: randomNum.toString().substring(0, 2),
            admission_no: `ADM-2026-${randomNum}`,
            address: "4/12, Test Lane, Campus Housing",
            emergency_contact: `98000${randomNum}`,
            pickup_route_id: routes[0]?.route_id || "",
            // Pickup stop logic would ideally filter, but for demo we just pick first if available
            pickup_stop_id: stops[0]?.stop_id || "", 
            drop_route_id: routes[0]?.route_id || "",
            drop_stop_id: stops[0]?.stop_id || "",
            student_photo_url: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`,
            study_year: "2025-2026",
            is_transport_user: true
        };
        setFormData(prev => ({ ...prev, ...dummyStudent }));
        
        // Generate random 4 digits to ensure uniqueness
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        
        setNewParent({
            name: "Rajesh Sharma",
            phone: `987654${randomSuffix}`, // Unique phone
            email: `rajesh.sharma${randomSuffix}@example.com`, // Unique email
            parent_role: "MOTHER", 
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
        setPhotoFile(null);
        setIsAddingNewParent(false);
        setIsSearchingParent(false);
        setParentSearchQuery('');
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[99999] transition-opacity duration-300" onClick={handleClose} />
            
            <div className={`fixed right-0 top-0 h-full bg-slate-50 shadow-2xl z-[100000] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
                (isAddingNewParent || isSearchingParent) ? 'w-full lg:w-[1300px]' : 'w-full md:w-[600px]'
            }`}>
                
                {/* Static Close Button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-6 right-8 z-[100010] w-12 h-12 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                >
                    <FontAwesomeIcon icon={faTimes} className="text-lg" />
                </button>


                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-hidden relative">
                    <div className={`h-full grid ${(isAddingNewParent || isSearchingParent) ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} divide-x divide-gray-200`}>
                        
                        {/* LEFT PANEL: Student Form */}
                        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar h-full">
                            {/* Modern Header (Moved Inside to be scrollable) */}
                            <div className="relative px-8 py-8 bg-slate-50 flex justify-between items-center z-10">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-700"></div>
                                        <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_10px_25px_rgba(58,123,255,0.25)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                            <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5">
                                            {initialData ? 'Edit Student' : 'Add Student'}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                                                {initialData ? 'Update Details' : 'Fill in student details'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={handleAutoFill}
                                        className="h-12 px-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] uppercase tracking-widest gap-2.5 transition-all active:scale-95 shadow-sm"
                                        title="Auto Fill"
                                    >
                                        <FontAwesomeIcon icon={faMagic} className="opacity-70" /> 
                                        <span>Auto Fill</span>
                                    </button>
                                </div>
                            </div>

                            <div className="px-8 pb-8 space-y-8 bg-slate-50 min-h-full">
                                
                                {/* Section: Personal Details */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                            <FontAwesomeIcon icon={faChild} className="text-2xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Student Info</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Basic Details</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <InputField 
                                            label="Name" 
                                            icon={faUser} 
                                            value={formData.name} 
                                            onChange={(e) => { 
                                                handleChange('name', e.target.value);
                                                if(errors.name) setErrors(prev => ({...prev, name: null}));
                                            }} 
                                            placeholder="Enter student name"
                                            error={errors.name} 
                                        />

                                        <div className="grid grid-cols-2 gap-5">
                                            <InputField 
                                                label="Date of Birth" 
                                                icon={faCalendar} 
                                                type="date"
                                                value={formData.dob} 
                                                onChange={(e) => {
                                                    handleChange('dob', e.target.value);
                                                    if(errors.dob) setErrors(prev => ({...prev, dob: null}));
                                                }}
                                                error={errors.dob} 
                                            />
                                            <SelectField 
                                                label="Gender" 
                                                icon={faUser} 
                                                value={formData.gender} 
                                                onChange={(e) => {
                                                    handleChange('gender', e.target.value);
                                                    if(errors.gender) setErrors(prev => ({...prev, gender: null}));
                                                }} 
                                                placeholder="Select Gender"
                                                options={[
                                                    { value: 'MALE', label: 'Male' },
                                                    { value: 'FEMALE', label: 'Female' },
                                                    { value: 'OTHER', label: 'Other' }
                                                ]}
                                                error={errors.gender}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1">
                                            <YearRangePicker 
                                                label="Academic Year"
                                                start={formData.yearStart}
                                                end={formData.yearEnd}
                                                onStartChange={(val) => handleChange('yearStart', val)}
                                                onEndChange={(val) => handleChange('yearEnd', val)}
                                            />
                                        </div>

                                        <ClassSelector 
                                            label="Class & Section" 
                                            value={formData.class_id} 
                                            onChange={(val) => {
                                                handleChange('class_id', val);
                                                if(errors.class_id) setErrors(prev => ({...prev, class_id: null}));
                                            }} 
                                            placeholder="Select Class"
                                            options={classes.filter(c => c.status === 'ACTIVE').map(c => ({
                                                value: c.class_id, 
                                                className: c.class_name,
                                                section: c.section
                                            }))} 
                                            error={errors.class_id}
                                            onAddClass={() => setShowAddClassForm(true)}
                                        />
                                        
                                        <InputField 
                                            label="Contact" 
                                            icon={faPhone} 
                                            type="tel"
                                            value={formData.emergency_contact}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                handleChange('emergency_contact', val);
                                                if(errors.emergency_contact) setErrors(prev => ({...prev, emergency_contact: null}));
                                            }}
                                            placeholder="10-digit phone number"
                                            error={errors.emergency_contact}
                                            maxLength={10}
                                        />

                                        <FileUploadField 
                                            label="Student Photo" 
                                            icon={faImage} 
                                            onFileSelect={setPhotoFile} 
                                            fileName={photoFile?.name || (formData.student_photo_url ? "Current Photo Saved" : "")} 
                                            onError={(msg) => setErrorModal({ show: true, message: msg })}
                                        />
                                    </div>
                                </div>

                                {/* Section: Parent/Guardian Link */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                            <FontAwesomeIcon icon={faUserTie} className="text-2xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Primary Parent</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Select or add parent</p>
                                        </div>
                                    </div>

                                    <div>
                                        {errors.parent_id && (
                                            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-pulse">
                                                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                                                    <FontAwesomeIcon icon={faWarning} className="text-xs" />
                                                </div>
                                                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Primary Parent Selection Required</p>
                                            </div>
                                        )}
                                        {formData.parent_id ? (() => {
                                            const selectedParent = localParents.find(p => p.parent_id == formData.parent_id);
                                            return selectedParent ? (
                                                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 relative group/card transition-all duration-500 hover:shadow-xl shadow-sm">
                                                    <div className="flex items-start justify-between mb-8">
                                                        <div className="flex items-center gap-5">
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-10 rounded-full"></div>
                                                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-sm relative z-10 border-2 border-blue-100">
                                                                    {selectedParent.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-xl text-slate-900 mb-2">{selectedParent.name}</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                                        {selectedParent.parent_role || 'MOTHER'}
                                                                    </span>
                                                                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
                                                                        <FontAwesomeIcon icon={faPhone} className="text-[9px] text-blue-500" /> {selectedParent.phone}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => { handleChange('parent_id', ''); }}
                                                            className="text-[10px] font-black text-rose-400/60 hover:text-rose-500 uppercase tracking-widest transition-all hover:tracking-[0.2em] py-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })() : (
                                            <div className="grid grid-cols-2 gap-5">
                                                <button 
                                                    onClick={() => { setTargetParentField('parent_id'); setIsAddingNewParent(false); setIsSearchingParent(true); }}
                                                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group text-center"
                                                >
                                                    <div className="w-16 h-16 rounded-[22px] bg-white border border-slate-100 text-slate-400 flex items-center justify-center mb-5 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                                                        <FontAwesomeIcon icon={faSearch} className="text-xl" />
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-wider">Search Parent</h5>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">From list</p>
                                                </button>

                                                <button 
                                                    onClick={() => { setTargetParentField('parent_id'); setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group text-center"
                                                >
                                                    <div className="w-16 h-16 rounded-[22px] bg-white border border-slate-100 text-slate-400 flex items-center justify-center mb-5 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-12 transition-all duration-500">
                                                        <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-wider">Add New</h5>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Create parent</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Secondary Parent (Optional) */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUserTie} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Secondary Parent (Optional)</h4>
                                            <p className="text-xs text-gray-500 font-medium">Add another parent</p>
                                        </div>
                                    </div>

                                    <div>
                                        {errors.s_parent_id && (
                                            <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-pulse">
                                                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                                                    <FontAwesomeIcon icon={faWarning} className="text-xs" />
                                                </div>
                                                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">{errors.s_parent_id}</p>
                                            </div>
                                        )}
                                        {formData.s_parent_id ? (() => {
                                            const selectedParent = localParents.find(p => p.parent_id == formData.s_parent_id);
                                            return selectedParent ? (
                                                 <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 relative group/card transition-all duration-500 hover:shadow-xl shadow-sm">
                                                     <div className="flex items-start justify-between mb-8">
                                                         <div className="flex items-center gap-5">
                                                             <div className="relative">
                                                                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-10 rounded-full"></div>
                                                                 <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-sm relative z-10 border-2 border-indigo-100">
                                                                     {selectedParent.name.charAt(0)}
                                                                 </div>
                                                             </div>
                                                             <div>
                                                                 <div className="font-black text-xl text-slate-900 mb-2">{selectedParent.name}</div>
                                                                 <div className="flex flex-wrap gap-2">
                                                                     <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                                         {selectedParent.parent_role || 'MOTHER'}
                                                                     </span>
                                                                     <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
                                                                         <FontAwesomeIcon icon={faPhone} className="text-[9px] text-indigo-500" /> {selectedParent.phone}
                                                                     </span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                                             <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                         </div>
                                                     </div>
                                                     
                                                     <div className="flex justify-center">
                                                         <button 
                                                             onClick={() => { handleChange('s_parent_id', ''); }}
                                                             className="text-[10px] font-black text-rose-400/60 hover:text-rose-500 uppercase tracking-widest transition-all hover:tracking-[0.2em] py-2"
                                                         >
                                                             Remove
                                                         </button>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })() : (
                                            <div className="grid grid-cols-2 gap-5">
                                                <button 
                                                    onClick={() => { setTargetParentField('s_parent_id'); setIsAddingNewParent(false); setIsSearchingParent(true); }}
                                                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group text-center"
                                                >
                                                    <div className="w-16 h-16 rounded-[22px] bg-white border border-slate-100 text-slate-400 flex items-center justify-center mb-5 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                                                        <FontAwesomeIcon icon={faSearch} className="text-xl" />
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-wider">Search Parent</h5>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">From list</p>
                                                </button>

                                                <button 
                                                    onClick={() => { setTargetParentField('s_parent_id'); setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group text-center"
                                                >
                                                    <div className="w-16 h-16 rounded-[22px] bg-white border border-slate-100 text-slate-400 flex items-center justify-center mb-5 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-12 transition-all duration-500">
                                                        <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-wider">Add New</h5>
                                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Create parent</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Transport */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                                <FontAwesomeIcon icon={faBus} className="text-2xl" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Bus Details</h4>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Pickup & Drop Info</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
                                            <button
                                                onClick={() => handleChange('is_transport_user', true)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${formData.is_transport_user ? 'bg-white text-blue-600 shadow-md transform scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                onClick={() => handleChange('is_transport_user', false)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${!formData.is_transport_user ? 'bg-white text-slate-600 shadow-md transform scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                No Bus
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {formData.is_transport_user ? (
                                        <div className="space-y-6 animate-fade-in-down">
                                            {/* Pickup Sub-Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
                                                    <FontAwesomeIcon icon={faArrowRight} /> Pickup
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <RouteSelector 
                                                        label="Pickup Route" 
                                                        value={formData.pickup_route_id} 
                                                        onChange={(val) => {
                                                            handleChange('pickup_route_id', val);
                                                            if(errors.pickup_route_id) setErrors(prev => ({...prev, pickup_route_id: null}));
                                                        }} 
                                                        placeholder="Select Pickup Route"
                                                        options={routes.filter(r => (r.routes_active_status || r.status) === 'ACTIVE').map(r => ({value: r.route_id, label: r.name}))} 
                                                        error={errors.pickup_route_id}
                                                        onAdd={() => window.open('/routes/add', '_blank')}
                                                        addLabel="Add New Route"
                                                    />
                                                    <StopSelector 
                                                        label="Pickup Stop" 
                                                        value={formData.pickup_stop_id} 
                                                        activeColor="teal"
                                                        onChange={(val) => {
                                                            handleChange('pickup_stop_id', val);
                                                            if(errors.pickup_stop_id) setErrors(prev => ({...prev, pickup_stop_id: null}));
                                                        }} 
                                                        placeholder={formData.pickup_route_id ? "Select Pickup Stop" : "Select Route First"}
                                                        disabled={!formData.pickup_route_id}
                                                        options={filteredPickupStops.map(s => ({value: s.stop_id, name: s.stop_name, order: s.pickup_stop_order}))} 
                                                        error={errors.pickup_stop_id}
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t border-dashed border-gray-200"></div>

                                            {/* Drop Sub-Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                                                    <FontAwesomeIcon icon={faHome} /> Drop
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <RouteSelector 
                                                        label="Drop Route" 
                                                        value={formData.drop_route_id} 
                                                        onChange={(val) => {
                                                            handleChange('drop_route_id', val);
                                                            if(errors.drop_route_id) setErrors(prev => ({...prev, drop_route_id: null}));
                                                        }} 
                                                        placeholder="Select Drop Route"
                                                        options={routes.filter(r => (r.routes_active_status || r.status) === 'ACTIVE').map(r => ({value: r.route_id, label: r.name}))} 
                                                        error={errors.drop_route_id}
                                                        onAdd={() => window.open('/routes/add', '_blank')}
                                                        addLabel="Add New Route"
                                                    />
                                                    <StopSelector 
                                                        label="Drop Stop" 
                                                        activeColor="orange"
                                                        value={formData.drop_stop_id} 
                                                        onChange={(val) => {
                                                            handleChange('drop_stop_id', val);
                                                            if(errors.drop_stop_id) setErrors(prev => ({...prev, drop_stop_id: null}));
                                                        }} 
                                                        placeholder={formData.drop_route_id ? "Select Drop Stop" : "Select Route First"}
                                                        disabled={!formData.drop_route_id}
                                                        options={filteredDropStops.map(s => ({value: s.stop_id, name: s.stop_name, order: s.drop_stop_order}))} 
                                                        error={errors.drop_stop_id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-gray-400 font-medium">This student does not use the school bus.</p>
                                        </div>
                                    )}
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
                                            {errors.apiError && (
                                                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-bounce">
                                                    <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faWarning} className="text-xs" />
                                                    </div>
                                                    <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">{errors.apiError}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 gap-6">
                                                <InputField label="Parent Name" icon={faUserTie} value={newParent.name} onChange={(e) => { handleParentChange('name', e.target.value); if(errors.parentName) setErrors(prev => ({...prev, parentName: null})); }} placeholder="Enter parent name" error={errors.parentName} />
                                                <div className="grid grid-cols-2 gap-5">
                                                    <SelectField 
                                                        label="Role" icon={faUser} value={newParent.parent_role} onChange={(e) => { handleParentChange('parent_role', e.target.value); if(errors.parentRole) setErrors(prev => ({...prev, parentRole: null})); }} 
                                                        options={[{value: 'MOTHER', label: 'Mother'}, {value: 'FATHER', label: 'Father'}, {value: 'GUARDIAN', label: 'Guardian'}]}
                                                        error={errors.parentRole}
                                                    />
                                                    <InputField 
                                                        label="Phone" icon={faPhone} type="tel" value={newParent.phone} 
                                                        onChange={(e) => { 
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                            handleParentChange('phone', val); 
                                                            if(errors.parentPhone) setErrors(prev => ({...prev, parentPhone: null})); 
                                                        }} 
                                                        placeholder="10-digit number" 
                                                        error={errors.parentPhone}
                                                        maxLength={10}
                                                    />
                                                </div>
                                                <InputField label="Email" icon={faEnvelope} type="email" value={newParent.email} onChange={(e) => handleParentChange('email', e.target.value)} placeholder="email@example.com" />
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">Address</h5>
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
                                                {loadingParent ? 'Saving...' : 'Save Parent'}
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
                                                <div className="relative bg-white rounded-xl shadow-lg shadow-purple-900/5 flex items-center border border-gray-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                                    <div className="pl-4 text-gray-400 text-sm">
                                                        <FontAwesomeIcon icon={faSearch} />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        autoFocus
                                                        placeholder="Search by name or phone..." 
                                                        value={parentSearchQuery}
                                                        onChange={(e) => setParentSearchQuery(e.target.value)}
                                                        className="w-full px-4 py-3 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 min-h-0">
                                                <div className="space-y-4 pb-4">
                                                    {localParents.filter(p => {
                                                        const matchesSearch = p.name.toLowerCase().includes(parentSearchQuery.toLowerCase()) || 
                                                                            p.phone.toString().includes(parentSearchQuery) ||
                                                                            (p.email && p.email.toLowerCase().includes(parentSearchQuery.toLowerCase()));
                                                        
                                                        // STRICTLY ACTIVE ONLY
                                                        const isSelected = formData[targetParentField] == p.parent_id;
                                                        const isActive = p.parents_active_status === 'ACTIVE';
                                                        
                                                        return matchesSearch && (isActive || isSelected);
                                                    }).map(p => {
                                                        const isSelected = formData[targetParentField] == p.parent_id;
                                                        return (
                                                            <div 
                                                                key={p.parent_id} 
                                                                onClick={() => { handleChange(targetParentField, p.parent_id); setIsSearchingParent(false); }}
                                                                className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer relative group overflow-hidden
                                                                    ${isSelected 
                                                                        ? 'bg-slate-900 border-slate-800 shadow-2xl scale-[1.02] z-10' 
                                                                        : 'bg-white border-slate-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1'}`}
                                                            >
                                                                <div className="flex items-center gap-6 z-10 relative">
                                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shadow-inner shrink-0 transition-all duration-500
                                                                        ${isSelected ? 'bg-blue-600 text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:-rotate-6'}`}>
                                                                        {p.name.charAt(0)}
                                                                    </div>
                                                                    
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h5 className={`font-black text-lg truncate pr-4 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                                                {p.name}
                                                                            </h5>
                                                                            {isSelected && (
                                                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 animate-in zoom-in duration-500">
                                                                                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="flex flex-wrap gap-y-2 gap-x-4">
                                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${isSelected ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                                                                {p.parent_role || 'Parent'}
                                                                            </span>
                                                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                                <FontAwesomeIcon icon={faPhone} className="text-[10px] opacity-50" /> {p.phone}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Hover Glow */}
                                                                {!isSelected && <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>}
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    {localParents.filter(p => {
                                                        const matchesSearch = p.name.toLowerCase().includes(parentSearchQuery.toLowerCase()) || 
                                                                             p.phone.toString().includes(parentSearchQuery) ||
                                                                             (p.email && p.email.toLowerCase().includes(parentSearchQuery.toLowerCase()));
                                                        
                                                        const isSelected = formData[targetParentField] == p.parent_id;
                                                        const isActive = p.parents_active_status === 'ACTIVE';
                                                        
                                                        return matchesSearch && (isActive || isSelected);
                                                    }).length === 0 && (
                                                        <div className="text-center py-16 px-6">
                                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                                <FontAwesomeIcon icon={faSearch} className="text-2xl" />
                                                            </div>
                                                            <h5 className="text-gray-900 font-bold text-lg mb-1">No results</h5>
                                                            <p className="text-gray-500 text-sm">No parent found for "{parentSearchQuery}"</p>
                                                            <button 
                                                                onClick={() => { setIsSearchingParent(false); setIsAddingNewParent(true); }}
                                                                className="mt-6 text-blue-600 font-bold hover:underline"
                                                            >
                                                                Add new parent?
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
                <div className="px-10 py-6 border-t border-slate-100 bg-white/80 backdrop-blur-2xl flex-shrink-0 z-20 flex justify-center">
                    <button
                        onClick={handleSaveStudent}
                        disabled={loadingSave}
                        className={`px-8 py-3.5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] text-white shadow-[0_15px_30px_rgba(58,123,255,0.2)] hover:shadow-[0_20px_40px_rgba(58,123,255,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-500 flex items-center gap-3 group relative overflow-hidden ${loadingSave ? 'opacity-70 cursor-not-allowed' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}
                    >
                        {/* Shimmer Effect */}
                        {!loadingSave && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
                        
                        <span className="relative z-10">
                            {loadingSave ? 'Saving...' : (initialData ? 'Save Changes' : 'Save Student')}
                        </span>
                        <div className={`w-8 h-8 ${loadingSave ? '' : 'bg-white/15'} rounded-full flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700 relative z-10 border border-white/20`}>
                            {loadingSave ? (
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-[10px]" />
                            ) : (
                                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Add Class Form Popup */}
            {showAddClassForm && (
                <AddClassForm
                    show={showAddClassForm}
                    onClose={() => setShowAddClassForm(false)}
                    onAdd={async (newClass) => {
                        try {
                            // Refresh classes list
                            const classesData = await classService.getAllClasses();
                            setClasses(classesData || []);
                            // Auto-select the newly created class
                            if (newClass?.class_id) {
                                handleChange('class_id', newClass.class_id);
                                if (errors.class_id) setErrors(prev => ({ ...prev, class_id: null }));
                            }
                        } catch (err) {
                            console.error('Failed to refresh classes:', err);
                        }
                    }}
                />
            )}

            {/* Error Notification Modal */}
            {errorModal.show && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setErrorModal({ show: false, message: '' })}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Notice</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                {errorModal.message}
                            </p>
                            <div className="flex w-full">
                                <button
                                    onClick={() => setErrorModal({ show: false, message: '' })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddStudentForm;
