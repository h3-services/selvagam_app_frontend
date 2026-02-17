import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, faSearch, faCheck, faUserGraduate, 
    faLink, faCircleNotch, faUserPlus, faFilter,
    faChevronRight, faShieldAlt, faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { COLORS } from '../../constants/colors';

const LinkStudentModal = ({ show, onClose, parent, onRefresh }) => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [linkType, setLinkType] = useState('PRIMARY'); // 'PRIMARY' or 'SECONDARY'
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        if (show) {
            fetchData();
            setSelectedStudents([]);
            setSearchQuery("");
        }
    }, [show]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsData, classesData] = await Promise.all([
                studentService.getAllStudents(),
                classService.getAllClasses()
            ]);
            setStudents(Array.isArray(studentsData) ? studentsData : (studentsData.data || []));
            setClasses(Array.isArray(classesData) ? classesData : (classesData.data || []));
        } catch (error) {
            console.error("Failed to fetch students for linking:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Don't show students already linked in ANY capacity (Primary or Secondary)
            const isAlreadyLinked = 
                student.parent_id === parent?.parent_id || 
                student.s_parent_id === parent?.parent_id;
            
            return matchesSearch && !isAlreadyLinked;
        });
    }, [students, searchQuery, linkType, parent]);

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId) 
                : [...prev, studentId]
        );
    };

    const handleLink = async () => {
        if (selectedStudents.length === 0) return;
        
        setIsLinking(true);
        try {
            await Promise.all(selectedStudents.map(async (studentId) => {
                const student = students.find(s => s.student_id === studentId);
                if (linkType === 'PRIMARY') {
                    await studentService.updatePrimaryParent(studentId, parent.parent_id);
                } else {
                    await studentService.updateSecondaryParent(studentId, parent.parent_id);
                }
            }));
            
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Failed to link students:", error);
            alert("Partial or complete failure in registry synchronization.");
        } finally {
            setIsLinking(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[2005] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                
                {/* Header */}
                <div className="px-8 py-8 border-b border-slate-100 bg-[#fcfcfd] flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
                            <FontAwesomeIcon icon={faLink} className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5 font-['Outfit']">Connect Family Link</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Registry Synchronization for {parent?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-90">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Configuration Bar */}
                <div className="px-8 py-6 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                        <button 
                            onClick={() => setLinkType('PRIMARY')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${linkType === 'PRIMARY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Primary Guardian
                        </button>
                        <button 
                            onClick={() => setLinkType('SECONDARY')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${linkType === 'SECONDARY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Secondary Guardian
                        </button>
                    </div>

                    <div className="relative flex-1 max-w-md group/search">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-blue-500 transition-colors">
                            <FontAwesomeIcon icon={faSearch} className="text-sm" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Find students to link..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* Student Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-3xl mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Accessing Student Registry...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2rem]">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-4xl mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No matching students found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStudents.map(student => {
                                const isSelected = selectedStudents.includes(student.student_id);
                                const studentClass = classes.find(c => c.class_id === student.class_id);
                                
                                return (
                                    <div 
                                        key={student.student_id}
                                        onClick={() => toggleStudentSelection(student.student_id)}
                                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-500/10' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                                {student.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{student.name}</h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {studentClass ? `${studentClass.class_name} - ${studentClass.section}` : 'N/A'}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-in zoom-in duration-300">
                                                    <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-8 border-t border-slate-100 bg-white flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Selection</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{selectedStudents.length} Students Queued</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl bg-slate-50 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={selectedStudents.length === 0 || isLinking}
                            onClick={handleLink}
                            className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-slate-200 enabled:hover:bg-black"
                        >
                            {isLinking ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleNotch} spin />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <span>Commit Connection</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default LinkStudentModal;
