import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCheck, 
    faArrowRight, 
    faCircleNotch, 
    faCogs,
    faTrophy,
    faArrowTrendUp,
    faUserGraduate,
    faExclamationCircle,
    faCalendarAlt,
    faShieldAlt,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';
import { COLORS } from '../../constants/colors';

const PromoteStudentsModal = ({ show, onClose, onRefresh }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Form States
    const [newStudyYear, setNewStudyYear] = useState('');
    const [maxClass, setMaxClass] = useState(12); // Default to 12
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            fetchClasses();
            setShowSuccess(false);
            setError(null);
        }
    }, [show]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const data = await classService.getAllClasses();
            const classList = Array.isArray(data) ? data : (data?.data || []);
            setClasses(classList);

            // Detect Max Class dynamically from existing classes
            let detectedMax = 0;
            classList.forEach(c => {
                const match = c.class_name.match(/\d+/);
                if (match) {
                    const num = parseInt(match[0]);
                    if (num > detectedMax) detectedMax = num;
                }
            });
            
            if (detectedMax > 0) {
                setMaxClass(detectedMax);
            }
            
            // Try to predict next study year if common pattern (e.g. 2024-25 -> 2025-26)
            // But we'll leave it empty for user to enter as it's critical
        } catch (error) {
            console.error("Failed to load classes:", error);
            setError("Could not load classes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePromotion = async () => {
        if (!newStudyYear) {
            setError("New Study Year is required for synchronization.");
            return;
        }

        const confirmMsg = `WARNING: This will promote ALL students in the system. Students in Class ${maxClass} will be marked as GRADUATED. This action CANNOT be undone. Proceed with Bulk Promotion to Academic Year ${newStudyYear}?`;
        
        if (!window.confirm(confirmMsg)) return;

        setPromoting(true);
        setError(null);

        try {
            await classService.promoteAllClasses({
                new_study_year: newStudyYear,
                max_class: parseInt(maxClass)
            });
            
            setShowSuccess(true);
            setTimeout(() => {
                onRefresh();
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Bulk Promotion Engine Failure:", err);
            setError(err.response?.data?.detail || "Bulk promotion protocol failed. Please check server logs.");
        } finally {
            setPromoting(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[2005] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 w-full max-w-xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-[#fcfcfd]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-indigo-100">
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none mb-1">Promotion Engine</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">Bulk Academic Transition</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all border border-slate-100">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {showSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">Promotion Complete</h4>
                            <p className="text-slate-500 text-sm font-medium">All student records have been successfully synchronized to {newStudyYear}.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 text-amber-700">
                                <FontAwesomeIcon icon={faExclamationCircle} className="mt-1 text-lg" />
                                <div className="text-xs font-bold leading-relaxed">
                                    This operation will increment the class for all students and update their study year. Final year students will be moved to Graduation status.
                                </div>
                            </div>

                            {/* New Study Year Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Academic Year</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="E.g., 2025-26"
                                        value={newStudyYear}
                                        onChange={(e) => setNewStudyYear(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Max Class Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highest School Grade (Graduation Gate)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <FontAwesomeIcon icon={faTrophy} />
                                    </div>
                                    <input
                                        type="number"
                                        value={maxClass}
                                        onChange={(e) => setMaxClass(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-400 font-medium italic ml-1">* Students in this grade will be marked as 'Graduated' upon promotion.</p>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-3 text-rose-600 text-[11px] font-black uppercase tracking-wide">
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                    {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!showSuccess && (
                    <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-slate-400 px-2">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-xs" />
                            <p className="text-[9px] font-black uppercase tracking-widest">Two-factor confirmation required for execution</p>
                        </div>
                        <button
                            onClick={handlePromotion}
                            disabled={promoting || loading}
                            className={`w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group ${promoting ? 'opacity-70' : 'hover:bg-black'}`}
                        >
                            {promoting ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleNotch} spin />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faTrophy} className="text-amber-400" />
                                    <span>Execute Bulk Promotion</span>
                                </>
                            )}
                            
                            {/* Animated Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer duration-1000" />
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default PromoteStudentsModal;
