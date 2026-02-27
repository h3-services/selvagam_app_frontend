import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faUserPlus, 
    faUser, 
    faEnvelope, 
    faPhone, 
    faIdCard, 
    faCalendarAlt, 
    faPassport, 
    faCheck, 
    faLock, 
    faLink, 
    faMagic,
    faFingerprint,
    faBriefcase,
    faCameraRetro,
    faIdBadge,
    faChevronDown,
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, error, maxLength }) => (
    <div className="relative group/field">
        <div className="flex justify-between items-center mb-1.5 px-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
            {error && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter animate-pulse">{error}</span>}
        </div>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className={`w-12 h-12 flex items-center justify-center absolute left-0 top-0 pointer-events-none transition-all duration-500 ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within/field:text-blue-600 group-focus-within/field:scale-110'}`}>
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

const AddDriverForm = ({ show, onClose, onAdd, onUpdate, initialData }) => {
    const [newDriver, setNewDriver] = useState({
        name: '', phone: '', email: '', licence_number: '',
        licence_expiry: '', fcm_token: 'string', password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (show) {
            if (initialData) {
                setNewDriver({
                    ...initialData,
                    phone: String(initialData.phone || initialData.mobile || ''),
                    licence_number: initialData.licence_number || initialData.licenseNumber || '',
                    password: '' // Keep password empty on edit unless changed
                });
            } else {
                // Reset form when opening for "Add"
                setNewDriver({
                    name: '', phone: '', email: '', licence_number: '',
                    licence_expiry: '', fcm_token: 'string', password: ''
                });
            }
            setTouched({});
        }
    }, [initialData, show]);

    const validate = (values) => {
        const errors = {};
        if (!values.name?.trim()) errors.name = "Required";
        if (values.email?.trim() && !/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid";
        if (!values.phone) errors.phone = "Required";
        else if (values.phone.length !== 10) errors.phone = "10 Digits";
        
        // Password only required for new enrollment
        if (!initialData && !values.password) errors.password = "Required";
        
        if (!values.licence_number?.trim()) errors.licence_number = "Required";
        if (!values.licence_expiry) errors.licence_expiry = "Required";
        return errors;
    };

    const errors = validate(newDriver);
    const isValid = Object.keys(errors).length === 0;

    const handleAction = async () => {
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        const currentErrors = validate(newDriver);
        if (Object.keys(currentErrors).length === 0) {
            setIsSubmitting(true);
            try {
                if (initialData) {
                    await onUpdate({
                        ...newDriver,
                        id: initialData.id,
                        phone: Number(newDriver.phone)
                    });
                } else {
                    await onAdd({
                        ...newDriver,
                        phone: Number(newDriver.phone)
                    });
                }
                onClose();
                setNewDriver({
                    name: '', phone: '', email: '', licence_number: '',
                    licence_expiry: '', fcm_token: 'string', password: ''
                });
                setTouched({});
            } catch (error) {
                console.error("Failed to process driver protocol:", error);
                alert("Operation failed. Please check registry protocols.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const updateField = (field, value) => {
        if (field === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 10) setNewDriver(prev => ({ ...prev, [field]: numericValue }));
        } else {
            setNewDriver(prev => ({ ...prev, [field]: value }));
        }
        if (!touched[field]) setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleAutoFill = () => {
        const randomNum = Math.floor(Math.random() * 10000);
        const randomPhone = "9" + Math.floor(Math.random() * 1000000000).toString().substring(0, 9);
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 5);

        setNewDriver({
            name: `Driver ${randomNum}`,
            email: `driver${randomNum}@fleet.com`,
            phone: randomPhone,
            licence_number: `DL-${randomNum}-IND`,
            licence_expiry: futureDate.toISOString().split('T')[0],
            fcm_token: `fcm_token_${randomNum}`,
            password: 'AuthPassword2024'
        });
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[99999] transition-opacity duration-300" onClick={onClose} />
            
            <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-50 shadow-2xl z-[100000] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                
                {/* Header Substrate */}
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
                                {initialData ? 'Update Profile' : 'Enroll Driver'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">API Core Compliance</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleAutoFill}
                            className="h-12 px-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] uppercase tracking-widest gap-2.5 transition-all active:scale-95 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faMagic} className="opacity-70" /> 
                            <span>Auto Pilot</span>
                        </button>
                        <button 
                            onClick={onClose} 
                            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form Environment */}
                <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-8 custom-scrollbar">
                    
                    {/* Driver Info Section */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faFingerprint} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Driver Info</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Basic Details</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <InputField label="Full Name" icon={faUser} value={newDriver.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full Name" error={touched.name && errors.name} />
                            
                            <div className="grid grid-cols-2 gap-5">
                                <InputField label="Contact Terminal" icon={faPhone} value={newDriver.phone} onChange={(e) => updateField('phone', e.target.value)} type="tel" maxLength={10} placeholder="10-Digit Mobile" error={touched.phone && errors.phone} />
                                <InputField label="Digital Mail" icon={faEnvelope} value={newDriver.email} onChange={(e) => updateField('email', e.target.value)} type="email" placeholder="user@example.com" error={touched.email && errors.email} />
                            </div>
                            
                            {!initialData && (
                                <InputField label="Auth Password" icon={faLock} value={newDriver.password} onChange={(e) => updateField('password', e.target.value)} type="password" placeholder="System Access" error={touched.password && errors.password} />
                            )}
                        </div>
                    </div>

                    {/* Operational Clearance Bento */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faBriefcase} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Operational Clearance</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Compliance & Credentials</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <InputField label="License ID" icon={faIdCard} value={newDriver.licence_number} onChange={(e) => updateField('licence_number', e.target.value)} placeholder="DL-XXXX-XXXX" error={touched.licence_number && errors.licence_number} />
                            <InputField label="Clearance Expiry" icon={faCalendarAlt} value={newDriver.licence_expiry} onChange={(e) => updateField('licence_expiry', e.target.value)} type="date" error={touched.licence_expiry && errors.licence_expiry} />
                        </div>
                    </div>
                </div>

                {/* Execution Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-20">
                    <button
                        onClick={handleAction}
                        disabled={!isValid && Object.keys(touched).length > 0 || isSubmitting}
                        className={`group w-full h-14 rounded-2xl font-black text-white text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${(!isValid && Object.keys(touched).length > 0) || isSubmitting ? 'bg-slate-400 opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-blue-500/25 active:scale-95'}`}
                        style={{ 
                            background: (isValid || Object.keys(touched).length === 0) && !isSubmitting
                                ? 'linear-gradient(135deg, #3A7BFF 0%, #1e3a8a 100%)' 
                                : '' 
                        }}
                    >
                        <span>{isSubmitting ? 'Processing...' : (initialData ? 'Update Profile' : 'Register Driver')}</span>
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

export default AddDriverForm;
