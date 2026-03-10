import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faPhone, faEnvelope, faMapMarkerAlt, faLock, faUserPlus, faMagic, faCheck, faShieldAlt, faSignature, faEdit, faChevronDown, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-[13px] font-extrabold text-slate-700 placeholder-slate-300 focus:outline-none disabled:text-slate-400"
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

const AddParentForm = ({ show, onClose, onAdd, onUpdate, initialData }) => {
    const defaultState = {
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        district: '',
        pincode: '',
        door_no: '',
        parent_role: 'MOTHER'
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                street: initialData.street || '',
                city: initialData.city || '',
                district: initialData.district || '',
                pincode: initialData.pincode || '',
                door_no: initialData.door_no || '',
                parent_role: initialData.parent_role || 'MOTHER'
            });
        } else {
            setFormData(defaultState);
        }
    }, [initialData, show]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAutoFill = () => {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        setFormData({
            name: 'Vikram Seth',
            email: `vikram.seth${randomSuffix}@example.com`,
            phone: `998877${randomSuffix}`,
            password: 'Parent@secure123',
            street: '45/A, Sterling Towers, MG Road',
            city: 'Bangalore',
            district: 'Urban',
            pincode: '560001',
            door_no: '45/A',
            parent_role: 'FATHER'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                phone: Number(formData.phone) || 0
            };

            if (initialData) {
                await onUpdate(initialData.parent_id, payload);
            } else {
                await onAdd(payload);
            }
            
            setFormData(defaultState);
            onClose();
        } catch (error) {
            console.error("Failed to process parent data:", error);
            alert("Execution failed. Please check registry protocols.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[99999] transition-all duration-500 ease-in-out ${show ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={onClose} 
            />
            
            {/* Right Side Drawer */}
            <div 
                className={`fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[600px] bg-slate-50 shadow-[0_0_100px_rgba(0,0,0,0.3)] z-[100000] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${show ? 'translate-x-0' : 'translate-x-full'}`}
            >
                
                
                {/* Static Action Buttons (Close / Auto Fill) */}
                <div className="absolute top-6 right-6 sm:right-8 z-[100010] flex items-center gap-3">
                    <button 
                        type="button" 
                        onClick={handleAutoFill}
                        className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-blue-600 hover:text-white hover:border-blue-600 hover:bg-blue-600 transition-all duration-300 shadow-sm active:scale-90"
                        title="Auto Fill"
                    >
                        <FontAwesomeIcon icon={faMagic} className="text-sm" />
                    </button>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {/* Premium Header */}
                    <div className="relative px-6 sm:px-8 py-6 sm:py-10 flex justify-between items-center z-10">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-700"></div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] sm:rounded-[22px] flex items-center justify-center shadow-[0_15px_30px_rgba(58,123,255,0.3)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                        <FontAwesomeIcon icon={initialData ? faEdit : faUserPlus} className="text-lg sm:text-xl" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-none mb-1 sm:mb-1.5">{initialData ? 'Edit Parent' : 'Add Parent'}</h3>
                                </div>
                            </div>
                        </div>

                    {/* Form Layout */}
                    <div className="px-3 lg:px-8 pb-48 lg:pb-8 space-y-6 lg:space-y-8">
                        <form id="add-parent-form" onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Identity Section */}
                            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faSignature} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Parent Info</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Basic Info</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <InputField 
                                        label="Full Name" 
                                        icon={faUser} 
                                        value={formData.name} 
                                        onChange={(e) => handleChange('name', e.target.value)} 
                                        placeholder="Enter parent's full name" 
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SelectField 
                                            label="Parent Role" 
                                            icon={faShieldAlt} 
                                            value={formData.parent_role} 
                                            onChange={(e) => handleChange('parent_role', e.target.value)} 
                                            placeholder="Select Role"
                                            options={[
                                                { value: 'FATHER', label: 'Father' },
                                                { value: 'MOTHER', label: 'Mother' },
                                                { value: 'GUARDIAN', label: 'Guardian' }
                                            ]}
                                        />
                                        <InputField 
                                            label="Contact Number" 
                                            icon={faPhone} 
                                            value={formData.phone} 
                                            onChange={(e) => handleChange('phone', e.target.value)} 
                                            placeholder="9988776655" 
                                        />
                                    </div>
                                    <InputField 
                                        label="Email Protocol" 
                                        icon={faEnvelope} 
                                        type="email"
                                        value={formData.email} 
                                        onChange={(e) => handleChange('email', e.target.value)} 
                                        placeholder="name@domain.com" 
                                    />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Location</h4>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="sm:col-span-1">
                                            <InputField 
                                                label="Door No" 
                                                icon={faSignature} 
                                                value={formData.door_no} 
                                                onChange={(e) => handleChange('door_no', e.target.value)} 
                                                placeholder="45/A" 
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <InputField 
                                                label="Street Name" 
                                                icon={faMapMarkerAlt} 
                                                value={formData.street} 
                                                onChange={(e) => handleChange('street', e.target.value)} 
                                                placeholder="Sterling Towers, MG Road" 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField 
                                            label="City" 
                                            icon={faMapMarkerAlt} 
                                            value={formData.city} 
                                            onChange={(e) => handleChange('city', e.target.value)} 
                                            placeholder="Bangalore" 
                                        />
                                        <InputField 
                                            label="District" 
                                            icon={faMapMarkerAlt} 
                                            value={formData.district} 
                                            onChange={(e) => handleChange('district', e.target.value)} 
                                            placeholder="Urban" 
                                        />
                                    </div>
                                    <InputField 
                                        label="Pincode / Zip" 
                                        icon={faMapMarkerAlt} 
                                        value={formData.pincode} 
                                        onChange={(e) => handleChange('pincode', e.target.value)} 
                                        placeholder="560001" 
                                    />
                                </div>
                            </div>


                        </form>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="px-4 lg:px-8 py-3 lg:py-8 bg-white border-t border-slate-100 flex gap-2 lg:gap-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-3 lg:px-8 py-2.5 lg:py-4 bg-slate-50 border border-slate-200 text-slate-500 font-black uppercase tracking-widest rounded-xl lg:rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 text-[8px] lg:text-[11px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-parent-form"
                        disabled={isSubmitting}
                        className={`flex-[2] px-3 lg:px-8 py-2.5 lg:py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-xl lg:rounded-2xl hover:bg-black transition-all active:scale-95 text-[8px] lg:text-[11px] shadow-2xl shadow-slate-200 flex items-center justify-center gap-2 lg:gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-[10px] sm:text-xs" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheck} className="text-[10px] sm:text-xs" />
                                <span>{initialData ? 'Save Changes' : 'Save Parent'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddParentForm;
