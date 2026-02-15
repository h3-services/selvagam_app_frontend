import { useState } from 'react';
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
    faExclamationCircle, 
    faMagic,
    faFingerprint,
    faBriefcase,
    faCameraRetro,
    faIdBadge
} from '@fortawesome/free-solid-svg-icons';

const InputField = ({ label, icon, type = "text", placeholder, value, onChange, error, errorMessage, maxLength }) => {
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none group-focus-within:text-blue-600 transition-colors">
                    {label}
                </label>
                {error && (
                    <span className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter flex items-center gap-1 animate-pulse">
                        <FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage || "Required"}
                    </span>
                )}
            </div>
            <div className="relative">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${error ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 group-focus-within:bg-blue-600 group-focus-within:text-white group-focus-within:scale-110 group-focus-within:shadow-lg group-focus-within:shadow-blue-200'}`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    className={`w-full bg-[#fcfcfd] border border-slate-100 rounded-2xl pl-16 pr-5 py-3.5 text-sm font-black text-slate-900 focus:outline-none transition-all placeholder:text-slate-300 placeholder:font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 ${error ? 'border-rose-200 bg-rose-50/30' : ''}`}
                />
            </div>
        </div>
    );
};

const AddDriverForm = ({ show, onClose, onAdd }) => {
    const [newDriver, setNewDriver] = useState({
        name: '', phone: '', email: '', dob: '', licence_number: '',
        licence_expiry: '', aadhar_number: '', licence_url: '',
        aadhar_url: '', photo_url: '', password: ''
    });

    const [touched, setTouched] = useState({});

    const validate = (values) => {
        const errors = {};
        if (!values.name?.trim()) errors.name = "Required";
        if (values.email?.trim() && !/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid";
        if (!values.phone) errors.phone = "Required";
        else if (values.phone.length !== 10) errors.phone = "10 Digits";
        if (!values.dob) errors.dob = "Required";
        if (!values.password) errors.password = "Required";
        if (!values.licence_number?.trim()) errors.licence_number = "Required";
        if (!values.licence_expiry) errors.licence_expiry = "Required";
        if (!values.aadhar_number?.trim()) errors.aadhar_number = "Required";
        if (!values.photo_url?.trim()) errors.photo_url = "Required";
        if (!values.licence_url?.trim()) errors.licence_url = "Required";
        if (!values.aadhar_url?.trim()) errors.aadhar_url = "Required";
        return errors;
    };

    const errors = validate(newDriver);
    const isValid = Object.keys(errors).length === 0;

    const handleAdd = () => {
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        if (isValid) {
            onAdd({
                ...newDriver,
                phone: Number(newDriver.phone),
                status: 'ACTIVE'
            });
            setNewDriver({
                name: '', phone: '', email: '', dob: '', licence_number: '',
                licence_expiry: '', aadhar_number: '', licence_url: '',
                aadhar_url: '', photo_url: '', password: ''
            });
            setTouched({});
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

    const generateRandomDriver = () => {
        const randomNum = Math.floor(Math.random() * 10000);
        const randomPhone = "9" + Math.floor(Math.random() * 1000000000).toString().substring(0, 9);
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 5);

        setNewDriver({
            name: `Fleet Captain ${randomNum}`,
            email: `driver${randomNum}@fleet.com`,
            phone: randomPhone,
            dob: '1985-06-12',
            licence_number: `DL-${randomNum}-IND`,
            licence_expiry: futureDate.toISOString().split('T')[0],
            aadhar_number: `7854 5678 ${randomNum}`,
            photo_url: `https://i.pravatar.cc/300?u=${randomNum}`,
            licence_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            aadhar_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            password: 'AuthPassword2024'
        });
        const allTouched = Object.keys(newDriver).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);
    };

    if (!show) return null;

    const getFieldProps = (field) => ({
        error: touched[field] && !!errors[field],
        errorMessage: errors[field],
        value: newDriver[field],
        onChange: (e) => updateField(field, e.target.value)
    });

    return (
        <div className="fixed inset-0 z-[2000] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            
            <div className="relative w-full max-w-3xl bg-[#fcfcfd] h-full shadow-[-40px_0_80px_rgba(0,0,0,0.1)] flex flex-col animate-slide-in-right border-l border-slate-100">
                
                {/* Visual Header */}
                <div className="px-10 py-12 bg-white flex justify-between items-center group/header">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-indigo-200 transition-transform group-hover/header:scale-105 duration-500">
                            <FontAwesomeIcon icon={faUserPlus} className="text-3xl" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3 font-['Outfit']">Enroll Driver</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fleet Personnel Registry</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={generateRandomDriver} className="w-12 h-12 rounded-2xl bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center group/magic">
                            <FontAwesomeIcon icon={faMagic} className="group-hover/magic:rotate-12 transition-transform" />
                        </button>
                        <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center">
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Form Substrate */}
                <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar space-y-12">
                    
                    {/* Bento Card: Identity Core */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover/card:scale-110 transition-transform duration-700" />
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 relative z-10">
                            <FontAwesomeIcon icon={faFingerprint} className="text-blue-600" />
                            Identity Core
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <InputField label="Full Name" icon={faUser} {...getFieldProps('name')} placeholder="Captain's Legal Name" className="md:col-span-2" />
                            <InputField label="Contact Terminal" icon={faPhone} {...getFieldProps('phone')} type="tel" maxLength={10} placeholder="Primary 10-Digit Mobile" />
                            <InputField label="Digital Mail" icon={faEnvelope} {...getFieldProps('email')} type="email" placeholder="official@fleet.net" />
                            <InputField label="Lifecycle Origin" icon={faCalendarAlt} {...getFieldProps('dob')} type="date" />
                            <InputField label="System Clearance" icon={faLock} {...getFieldProps('password')} type="password" placeholder="Access Authentication" />
                        </div>
                    </div>

                    {/* Bento Card: Operational Clearance */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 group-hover/card:scale-110 transition-transform duration-700" />
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 relative z-10">
                            <FontAwesomeIcon icon={faBriefcase} className="text-blue-600" />
                            Operational Clearance
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <InputField label="License ID" icon={faIdCard} {...getFieldProps('licence_number')} placeholder="DL-STRAT-XXXX" />
                            <InputField label="Clearance Expiry" icon={faCalendarAlt} {...getFieldProps('licence_expiry')} type="date" />
                            <InputField label="Aadhar Directive" icon={faIdBadge} {...getFieldProps('aadhar_number')} placeholder="Universal ID Number" className="md:col-span-2" />
                        </div>
                    </div>

                    {/* Bento Card: Visual & Document Assets */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-16 -mt-16 group-hover/card:scale-110 transition-transform duration-700" />
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 relative z-10">
                            <FontAwesomeIcon icon={faCameraRetro} className="text-blue-600" />
                            Asset Synchronization
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <InputField label="Visual Profile URL" icon={faLink} {...getFieldProps('photo_url')} placeholder="Secure Avatar URI" className="md:col-span-2" />
                            <InputField label="Clearance Doc URL" icon={faLink} {...getFieldProps('licence_url')} placeholder="License Image URI" />
                            <InputField label="Registry Doc URL" icon={faLink} {...getFieldProps('aadhar_url')} placeholder="Aadhar Image URI" />
                        </div>
                    </div>
                </div>

                {/* Execution Footer */}
                <div className="px-10 py-10 bg-white border-t border-slate-100">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-5 rounded-[2rem] font-black text-white text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-5 transition-all shadow-2xl shadow-indigo-100 active:scale-95 ${!isValid && Object.keys(touched).length > 0 ? 'bg-slate-400 opacity-60' : 'bg-slate-900 hover:bg-black hover:shadow-indigo-200'}`}
                    >
                        <span>Authorize Fleet Member</span>
                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                            <FontAwesomeIcon icon={faCheck} className="text-sm" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDriverForm;
