import { useState, useEffect } from 'react';
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

const AddParentForm = ({ show, onClose, onAdd, onUpdate, initialData }) => {
    const defaultState = {
        name: '',
        email: '',
        phone: '',
        password: '',
        street: '',
        city: '',
        district: '',
        pincode: '',
        door_no: '',
        parent_role: 'GUARDIAN'
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                password: '', // Don't pre-fill password for security
                street: initialData.street || '',
                city: initialData.city || '',
                district: initialData.district || '',
                pincode: initialData.pincode || '',
                door_no: initialData.door_no || '',
                parent_role: initialData.parent_role || 'GUARDIAN'
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

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2005] transition-opacity duration-500" 
                onClick={onClose} 
            />
            
            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] md:w-[600px] bg-slate-50 shadow-[0_0_100px_rgba(0,0,0,0.3)] z-[2006] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) animate-in slide-in-from-right-full">
                
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
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${initialData ? 'bg-amber-500' : 'bg-blue-600'}`}></span>
                                    </div>
                                </div>
                            </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button 
                                type="button" 
                                onClick={handleAutoFill}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all active:scale-90"
                            >
                                <FontAwesomeIcon icon={faMagic} className="text-xs sm:text-sm" />
                            </button>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-90"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-base sm:text-lg" />
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
                                        <div className="relative group/field">
                                            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">Parent Role</label>
                                            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 hover:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all duration-500">
                                                <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600">
                                                    <FontAwesomeIcon icon={faShieldAlt} className="text-sm" />
                                                </div>
                                                <select 
                                                    value={formData.parent_role}
                                                    onChange={(e) => handleChange('parent_role', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-[13px] font-extrabold text-slate-700 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="FATHER">Father</option>
                                                    <option value="MOTHER">Mother</option>
                                                    <option value="GUARDIAN">Guardian</option>
                                                </select>
                                                <div className="absolute right-4 pointer-events-none text-slate-400">
                                                    <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                                                </div>
                                            </div>
                                        </div>
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
                            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
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

                            {!initialData && (
                                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Access Control</h4>
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
                            )}
                        </form>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white border-t border-slate-100 flex gap-3 sm:gap-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 sm:px-8 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 text-[10px] sm:text-[11px]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-parent-form"
                        disabled={isSubmitting}
                        className={`flex-[2] px-4 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-95 text-[10px] sm:text-[11px] shadow-2xl shadow-slate-200 flex items-center justify-center gap-2 sm:gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
