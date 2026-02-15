import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCheck, 
    faSchool, 
    faCalendarAlt, 
    faLayerGroup,
    faMagic,
    faShapes,
    faSignature,
    faSatellite,
    faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';
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

const SelectField = ({ label, icon, value, onChange, options, disabled = false }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                required
                className="w-full pl-12 pr-10 py-4 bg-transparent rounded-2xl text-[13px] font-extrabold text-slate-700 focus:outline-none disabled:text-slate-400 appearance-none cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 pointer-events-none text-slate-300">
                <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
            </div>
        </div>
    </div>
);

const AddClassForm = ({ show, onClose, onAdd }) => {
    const defaultState = {
        class_name: '',
        section: '',
        academic_year: '2025-2026',
        status: 'ACTIVE'
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAutoFill = () => {
        const sections = ['Alpha', 'Beta', 'Gamma', 'Delta', 'A', 'B', 'Ruby', 'Emerald'];
        const grades = ['10', '11', '12', 'Grade 7', 'Grade 8', 'Grade 9'];
        setFormData({
            class_name: grades[Math.floor(Math.random() * grades.length)],
            section: sections[Math.floor(Math.random() * sections.length)],
            academic_year: '2025-2026',
            status: 'ACTIVE'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await classService.createClass(formData);
            setFormData(defaultState);
            onAdd();
            onClose();
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Protocol Failure. Cluster creation aborted.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Ambient Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2005] transition-opacity duration-500" 
                onClick={onClose} 
            />
            
            {/* Premium Drawer Container */}
            <div className="fixed right-0 top-0 h-full w-full md:w-[550px] bg-slate-50 shadow-[0_0_100px_rgba(0,0,0,0.3)] z-[2006] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) animate-in slide-in-from-right-full">
                
                {/* Scrollable Intelligence Core */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    
                    {/* Dynamic Header */}
                    <div className="relative px-8 py-10 flex justify-between items-center z-10">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-indigo-600 blur-xl opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-700"></div>
                                <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_15px_30px_rgba(79,70,229,0.3)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #4f46e5)` }}>
                                    <FontAwesomeIcon icon={faShapes} className="text-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5 font-['Outfit']">Class Assembly</h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-indigo-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Academic Cell Registry</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                type="button" 
                                onClick={handleAutoFill}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-all active:scale-90"
                                title="Auto-Pilot Generation"
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

                    {/* Integrated Form Content */}
                    <div className="px-8 pb-8 space-y-8">
                        <form id="add-class-form" onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Structural Definition Section */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faSignature} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Structural Core</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Identity & Section</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <InputField 
                                        label="Grade / Class Name" 
                                        icon={faSchool} 
                                        value={formData.class_name} 
                                        onChange={(e) => handleChange('class_name', e.target.value)} 
                                        placeholder="e.g. Grade 10 or XII" 
                                    />

                                    <InputField 
                                        label="Strategic Section" 
                                        icon={faLayerGroup} 
                                        value={formData.section} 
                                        onChange={(e) => handleChange('section', e.target.value)} 
                                        placeholder="e.g. Beta, Alpha, or Section-B" 
                                    />
                                </div>
                            </div>

                            {/* Chronology & Status Section */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faSatellite} className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none">Operational Data</h4>
                                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Timeline & State</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <InputField 
                                        label="Academic Cycle" 
                                        icon={faCalendarAlt} 
                                        value={formData.academic_year} 
                                        onChange={(e) => handleChange('academic_year', e.target.value)} 
                                        placeholder="2025-2026" 
                                    />

                                    <SelectField 
                                        label="Activation State" 
                                        icon={faCheck} 
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        options={[
                                            { label: 'ACTIVE (Operational)', value: 'ACTIVE' },
                                            { label: 'INACTIVE (Archived)', value: 'INACTIVE' }
                                        ]}
                                    />
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                {/* Secure Command Footer */}
                <div className="px-8 py-8 bg-white border-t border-slate-100 flex gap-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-slate-50 border border-slate-200 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 text-[11px]"
                    >
                        Decline
                    </button>
                    <button
                        type="submit"
                        form="add-class-form"
                        disabled={isSubmitting}
                        className={`flex-[2] px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-95 text-[11px] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheck} />
                                <span>Register Cluster</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddClassForm;
