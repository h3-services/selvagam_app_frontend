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
    faMagic
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
        setSuccessCount(0);
        setErrorCount(0);
        try {
            const rawClasses = await classService.getAllClasses();
            const rawStudents = await studentService.getAllStudents();
            
            const classData = Array.isArray(rawClasses) ? rawClasses : (rawClasses?.data || []);
            const studentData = Array.isArray(rawStudents) ? rawStudents : (rawStudents?.data || []);
            
            console.log("Promotion Modal - Loaded:", { classesCount: classData.length, studentsCount: studentData.length });
            
            setClasses(classData);
            setStudents(studentData);

            // Auto-generate mapping intelligence with safety checks
            const initialMapping = {};
            classData.forEach(sourceClass => {
                const className = sourceClass.class_name || "";
                const gradeMatch = className.match(/\d+/);
                const currentGradeNum = gradeMatch ? parseInt(gradeMatch[0]) : NaN;

                if (!isNaN(currentGradeNum)) {
                    const nextGradeNum = currentGradeNum + 1;
                    const nextClass = classData.find(c => {
                        const tName = c.class_name || "";
                        const targetGradeMatch = tName.match(/\d+/);
                        const targetGradeNum = targetGradeMatch ? parseInt(targetGradeMatch[0]) : NaN;
                        return targetGradeNum === nextGradeNum && c.section === sourceClass.section;
                    });
                    
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
            console.error("Critical Promotion Engine Failure:", error);
            alert(`Terminal Synchronization Error: ${error.message || 'Check System Logs'}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePromotion = async () => {
        const affectedStudents = students.filter(student => {
            const nextClassId = promotionMapping[student.class_id];
            return nextClassId && nextClassId !== student.class_id;
        });

        if (affectedStudents.length === 0) {
            alert("Zero students found matching the current promotion criteria.");
            return;
        }

        const confirmMsg = `CRITICAL OPERATION: This will promote ${affectedStudents.length} students to their next academic level. This will modify live records. Proceed?`;
        if (!window.confirm(confirmMsg)) return;

        setPromoting(true);
        let success = 0;
        let errors = 0;

        // Process in throttled chunks to ensure system stability
        const CHUNK_SIZE = 10;
        const total = affectedStudents.length;

        for (let i = 0; i < total; i += CHUNK_SIZE) {
            const chunk = affectedStudents.slice(i, i + CHUNK_SIZE);
            
            await Promise.all(chunk.map(async (student) => {
                const nextClassId = promotionMapping[student.class_id];
                const studentId = student.student_id || student._id || student.id;
                
                if (!studentId) {
                    console.error("Critical Failure: Student ID missing on record", student);
                    errors++;
                    return;
                }

                try {
                    // We only send the updated class_id to preserve other data intact
                    // and ensure compatibility with various backend implementations
                    await studentService.updateStudent(studentId, {
                        ...student, // Keep existing data
                        class_id: nextClassId
                    });
                    success++;
                } catch (e) {
                    console.error(`Promotion Failed for student ${studentId}:`, e);
                    errors++;
                }
            }));
            
            setSuccessCount(success);
            setErrorCount(errors);
        }

        setPromoting(false);
        if (errors === 0) {
            alert(`SUCCESS: ${success} student cycles completed.`);
            onRefresh();
            onClose();
        } else {
            alert(`COMPLETED WITH ANOMALIES. Success: ${success}, Failure: ${errors}. Please audit student records.`);
            onRefresh();
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 z-[2005] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
                
                <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
                    
                    {/* Premium Header */}
                    <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-[#fcfcfd]">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-indigo-200">
                                <FontAwesomeIcon icon={faArrowTrendUp} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="font-black text-3xl text-slate-900 tracking-tight leading-none mb-2 font-['Outfit']">Promotion Engine</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Academic Cycle Orchestrator</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-90 border border-slate-100">
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    {/* Dashboard Body */}
                    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
                                    <FontAwesomeIcon icon={faCircleNotch} spin className="text-3xl" />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Student Grid...</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Mapping Grid */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 px-8 py-2">
                                        <div className="col-span-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">#</div>
                                        <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Origin</div>
                                        <div className="col-span-1"></div>
                                        <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transition Target</div>
                                    </div>

                                    <div className="space-y-3">
                                        {classes.filter(c => c.status === 'ACTIVE').map((sourceClass, idx) => (
                                            <div key={sourceClass.class_id} className="grid grid-cols-12 items-center bg-white hover:bg-slate-50 p-4 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                                                <div className="col-span-1 text-xs font-black text-slate-300 group-hover:text-indigo-400">{idx + 1}</div>
                                                <div className="col-span-5 flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-[#fcfcfd] border border-slate-100 flex items-center justify-center text-slate-900 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                        {sourceClass.class_name.match(/\d+/) || sourceClass.class_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-[13px] tracking-tight">{sourceClass.class_name} - {sourceClass.section}</p>
                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                                                            {students.filter(s => s.class_id === sourceClass.class_id).length} Active Students
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 flex justify-center text-slate-300 group-hover:text-indigo-500">
                                                    <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <div className="col-span-5">
                                                    <select
                                                        value={promotionMapping[sourceClass.class_id] || ""}
                                                        onChange={(e) => setPromotionMapping({...promotionMapping, [sourceClass.class_id]: e.target.value})}
                                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-black text-slate-700 tracking-tight focus:ring-4 focus:ring-blue-500/10 focus:border-indigo-400 focus:bg-white outline-none transition-all cursor-pointer appearance-none"
                                                    >
                                                        <option value="">-- Terminal Stage / None --</option>
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

                                {errorCount > 0 && (
                                    <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 flex items-center gap-5 text-rose-700">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="text-xl" />
                                        <p className="text-xs font-black uppercase tracking-widest">
                                            {errorCount} Records failed to synchronize. Please check connectivity and system logs.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Execution Footer */}
                    <div className="px-10 py-10 border-t border-slate-100 bg-white flex items-center justify-between gap-6">
                        <div className="flex gap-4">
                            {promoting && (
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Processing Batch: {successCount} / {students.filter(s => promotionMapping[s.class_id]).length}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                disabled={promoting}
                                className="px-8 py-4 rounded-2xl bg-slate-50 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handlePromotion}
                                disabled={promoting || loading}
                                className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-200 enabled:hover:bg-black"
                            >
                                {promoting ? (
                                    <>
                                        <FontAwesomeIcon icon={faCircleNotch} spin /> Orchestrating...
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
        </>
    );
};

export default PromoteStudentsModal;
