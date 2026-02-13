import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCheck, 
    faArrowRight, 
    faCircleNotch, 
    faExclamationTriangle,
    faCogs,
    faTrophy,
    faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';
import { studentService } from '../../services/studentService';
import { COLORS } from '../../constants/colors';

const PromoteStudentsModal = ({ show, onClose, onRefresh }) => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState(false);
    const [promotionMapping, setPromotionMapping] = useState({});
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);

    useEffect(() => {
        if (show) {
            fetchInitialData();
        }
    }, [show]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [classData, studentData] = await Promise.all([
                classService.getAllClasses(),
                studentService.getAllStudents()
            ]);
            setClasses(classData);
            setStudents(studentData);

            // Auto-generate mapping
            const initialMapping = {};
            classData.forEach(sourceClass => {
                const currentGrade = parseInt(sourceClass.class_name);
                if (!isNaN(currentGrade)) {
                    const nextGrade = currentGrade + 1;
                    const nextClass = classData.find(c => 
                        parseInt(c.class_name) === nextGrade && 
                        c.section === sourceClass.section
                    );
                    if (nextClass) {
                        initialMapping[sourceClass.class_id] = nextClass.class_id;
                    } else {
                        initialMapping[sourceClass.class_id] = ""; 
                    }
                } else {
                    initialMapping[sourceClass.class_id] = "";
                }
            });
            setPromotionMapping(initialMapping);
        } catch (error) {
            console.error("Failed to load promotion data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePromotion = async () => {
        const confirmMsg = "This will move students across classes based on your mapping. This action cannot be easily undone. Proceed?";
        if (!window.confirm(confirmMsg)) return;

        setPromoting(true);
        let success = 0;
        let errors = 0;

        const promotionTasks = [];

        students.forEach(student => {
            const nextClassId = promotionMapping[student.class_id];
            if (nextClassId && nextClassId !== student.class_id) {
                promotionTasks.push(async () => {
                    try {
                        await studentService.updateStudent(student.student_id, {
                            ...student,
                            class_id: nextClassId
                        });
                        return true;
                    } catch (e) {
                        console.error(`Failed to promote student ${student.student_id}:`, e);
                        return false;
                    }
                });
            }
        });

        if (promotionTasks.length === 0) {
            alert("No students found to promote based on current mapping.");
            setPromoting(false);
            return;
        }

        const CHUNK_SIZE = 5;
        for (let i = 0; i < promotionTasks.length; i += CHUNK_SIZE) {
            const chunk = promotionTasks.slice(i, i + CHUNK_SIZE);
            const results = await Promise.all(chunk.map(task => task()));
            results.forEach(res => res ? success++ : errors++);
            setSuccessCount(success);
            setErrorCount(errors);
        }

        setPromoting(false);
        if (errors === 0) {
            alert(`Successfully promoted ${success} students!`);
            onRefresh();
            onClose();
        } else {
            alert(`Completed with issues. Success: ${success}, Errors: ${errors}`);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">Academic Promotion</h3>
                            <p className="text-gray-500 font-medium">Automatic grade transition for students</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-3xl text-indigo-600 mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparing Student Records...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 border-dashed flex gap-5 items-center">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-100">
                                    <FontAwesomeIcon icon={faCogs} className="text-xl" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-lg mb-1">Smart Promotion Engine</h4>
                                    <p className="text-sm text-indigo-700 leading-relaxed font-medium">
                                        Verify mappings below to increase grades automatically for <strong>{students.length} students</strong>.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-12 px-6 py-2">
                                    <div className="col-span-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">#</div>
                                    <div className="col-span-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Current Class</div>
                                    <div className="col-span-1"></div>
                                    <div className="col-span-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Next Class (Target)</div>
                                </div>

                                <div className="space-y-2">
                                    {classes.filter(c => c.status === 'ACTIVE').map((sourceClass, idx) => (
                                        <div key={sourceClass.class_id} className="grid grid-cols-12 items-center bg-gray-50/50 hover:bg-white p-3 rounded-2xl border border-transparent hover:border-indigo-200 transition-all group">
                                            <div className="col-span-1 text-xs font-bold text-gray-400">{idx + 1}</div>
                                            <div className="col-span-5 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                                                    {sourceClass.class_name}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">Class {sourceClass.class_name} - {sourceClass.section}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                        {students.filter(s => s.class_id === sourceClass.class_id).length} Students
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-1 flex justify-center text-indigo-300">
                                                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                            <div className="col-span-5">
                                                <select
                                                    value={promotionMapping[sourceClass.class_id] || ""}
                                                    onChange={(e) => setPromotionMapping({...promotionMapping, [sourceClass.class_id]: e.target.value})}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all cursor-pointer appearance-none"
                                                >
                                                    <option value="">-- Graduated / None --</option>
                                                    {classes.map(target => (
                                                        <option key={target.class_id} value={target.class_id}>
                                                            {target.class_name} - {target.section} ({target.academic_year})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-white flex items-center justify-between gap-6">
                    <div className="flex gap-4">
                        {promoting && (
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                                    Done: {successCount}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={promoting}
                            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePromotion}
                            disabled={promoting || loading}
                            className="px-6 py-3 rounded-xl text-white font-bold flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                        >
                            {promoting ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleNotch} spin /> Promoting...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faTrophy} /> Execute Promotion
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoteStudentsModal;
