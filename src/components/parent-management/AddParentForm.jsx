import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faPhone, faEnvelope, faMapMarkerAlt, faLock, faUserPlus, faMagic, faCheck, faShieldAlt, faSignature } from '@fortawesome/free-solid-svg-icons';
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

const AddParentForm = ({ show, onClose, onAdd }) => {
    const defaultState = {
        name: '',
        email: '',
        phone: '',
        password: '',
        street: '',
        city: '',
        district: '',
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAutoFill = () => {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        setFormData({
            name: 'Vikram Seth',
            email: `vikram.seth${randomSuffix}@example.com`,
            phone: `998877${randomSuffix}`,
            password: 'parent@secure',
            street: '45/A, Sterling Towers, MG Road',
            city: 'Bangalore',
            district: 'Urban'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onAdd(formData);
            setFormData(defaultState);
            onClose();
        } catch (error) {
            console.error("Failed to add parent:", error);
            alert("Execution failed. Please check registry protocols.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2005] transition-opacity duration-500" 
                onClick={onClose} 
            />
            
            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-50 shadow-[0_0_100px_rgba(0,0,0,0.3)] z-[2006] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) animate-in slide-in-from-right-full">
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {/* Premium Header */}
                    <div className="relative px-8 py-10 flex justify-between items-center z-10">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-700"></div>
                                <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_15px_30px_rgba(58,123,255,0.3)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                    <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5">Parent Onboarding</h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">New Guardian Registry</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                type="button" 
                                onClick={handleAutoFill}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all active:scale-90"
                            >
                                <FontAwesomeIcon icon={faMagic} className="text-sm" />
                            </button>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-90"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Form Layout */}
                    <div className="px-8 pb-8 space-y-8">
                        <form id="add-parent-form" onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Identity Section */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faSignature} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Identity Core</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Registry Information</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <InputField 
                                        label="Full Legal Name" 
                                        icon={faUser} 
                                        value={formData.name} 
                                        onChange={(e) => handleChange('name', e.target.value)} 
                                        placeholder="Enter parent's full name" 
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField 
                                            label="Contact Number" 
                                            icon={faPhone} 
                                            value={formData.phone} 
                                            onChange={(e) => handleChange('phone', e.target.value)} 
                                            placeholder="9988776655" 
                                        />
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
                            </div>

                            {/* Access Section */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Access Control</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Account Credentials</p>
                                    </div>
                                </div>

                                <InputField 
                                    label="Secure Password" 
                                    icon={faLock} 
                                    type="password"
                                    value={formData.password} 
                                    onChange={(e) => handleChange('password', e.target.value)} 
                                    placeholder="••••••••" 
                                />
                            </div>

                            {/* Geo Data Section */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Geo Data</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Resident Address</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <InputField 
                                        label="Street Intelligence" 
                                        icon={faMapMarkerAlt} 
                                        value={formData.street} 
                                        onChange={(e) => handleChange('street', e.target.value)} 
                                        placeholder="Door No, Building, Street Name" 
                                    />
                                    <div className="grid grid-cols-2 gap-6">
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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="px-8 py-8 bg-white border-t border-slate-100 flex gap-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-slate-50 border border-slate-200 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 text-[11px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-parent-form"
                        disabled={isSubmitting}
                        className={`flex-[2] px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-95 text-[11px] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faMagic} spin />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheck} />
                                <span>Commit to Registry</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddParentForm;
