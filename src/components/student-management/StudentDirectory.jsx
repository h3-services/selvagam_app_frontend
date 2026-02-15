import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faGraduationCap, 
    faUserSlash, 
    faBus, 
    faWalking, 
    faUserCheck, 
    faUsers,
    faChevronRight,
    faClock,
    faUserTie,
    faPhone,
    faEllipsisV,
    faUserClock,
    faBan
} from '@fortawesome/free-solid-svg-icons';
import { studentService } from '../../services/studentService';
import { parentService } from '../../services/parentService';
import { classService } from '../../services/classService';
import { COLORS } from '../../constants/colors';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("DayScholar");
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeMenuId && !event.target.closest('.action-menu-container') && !event.target.closest('.action-menu-trigger')) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentData, parentData, classData] = await Promise.all([
                studentService.getAllStudents(),
                parentService.getAllParents(),
                classService.getAllClasses()
            ]);

            const mapped = studentData.map(s => {
                const parent1 = parentData.find(p => p.parent_id === s.parent_id);
                const studentClass = classData.find(c => c.class_id === s.class_id);
                const currentStatus = s.status || s.student_status || 'CURRENT';
                return {
                    id: s.student_id,
                    name: s.name,
                    className: studentClass ? `${studentClass.class_name} - ${studentClass.section}` : 'N/A',
                    parentName: parent1 ? parent1.name : 'Unknown',
                    mobile: parent1 ? parent1.phone : (s.emergency_contact || 'N/A'),
                    status: currentStatus,
                    isTransport: s.is_transport_user === true || s.is_transport_user === 1 || s.is_transport_user === "true",
                    transportStatus: s.transport_status,
                    date: s.created_at ? s.created_at.split('T')[0] : 'N/A',
                };
            });
            console.log("Mapped Directory Data:", mapped);
            setStudents(mapped);
        } catch (error) {
            console.error("Failed to fetch directory data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (studentId, newStatus) => {
        try {
            await studentService.updateStudentStatus(studentId, newStatus);
            setStudents(prev => prev.map(s => 
                s.id === studentId ? { ...s, status: newStatus } : s
            ));
            setActiveMenuId(null);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update student status");
        }
    };

    const handleTransportStatusUpdate = async (studentId, newStatus) => {
        try {
            await studentService.updateTransportStatus(studentId, newStatus);
            setStudents(prev => prev.map(s => 
                s.id === studentId ? { ...s, transportStatus: newStatus, isTransport: newStatus === 'ACTIVE' } : s
            ));
            setActiveMenuId(null);
        } catch (error) {
            console.error("Failed to update transport status:", error);
            alert("Failed to update transport status");
        }
    };

    const categories = [
        { id: 'DayScholar', label: 'Non-Bus Users', icon: faWalking, color: 'text-emerald-600' },
        { id: 'Alumni', label: 'Alumni', icon: faGraduationCap, color: 'text-blue-600' },
        { id: 'Discontinued', label: 'Discontinued', icon: faUserSlash, color: 'text-red-600' },
    ];

    const filteredStudents = useMemo(() => {
        let result = students;

        if (activeCategory === 'DayScholar') {
            // Directory 'Non-Bus Users' shows ONLY students with INACTIVE transport status
            result = result.filter(s => 
                s.transportStatus === 'INACTIVE' && 
                (s.status === 'CURRENT' || !s.status)
            );
        } else if (activeCategory === 'Alumni') {
            result = result.filter(s => s.status === 'ALUMNI');
        } else if (activeCategory === 'Discontinued') {
            result = result.filter(s => s.status === 'DISCONTINUED' || s.status === 'LONG_ABSENT' || s.status === 'INACTIVE');
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s => 
                s.name.toLowerCase().includes(q) || 
                s.className.toLowerCase().includes(q)
            );
        }

        return result;
    }, [students, activeCategory, searchQuery]);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Record Directory</h1>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeCategory === cat.id 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={cat.icon} className="mr-2 opacity-70" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-8 pt-6 pb-8 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUsers} spin className="text-2xl text-blue-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Accessing Archives...</p>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredStudents.map((student) => (
                            <div 
                                key={student.id} 
                                className={`group bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 relative flex flex-col gap-4 ${
                                    activeMenuId === student.id ? 'z-[50] ring-2 ring-blue-500/20 shadow-2xl scale-[1.01]' : 'z-10'
                                }`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50/50 rounded-full -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors pointer-events-none"></div>
                                
                                <div className="flex items-center justify-between relative z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#3A7BFF] text-white flex items-center justify-center text-sm font-black shadow-lg shadow-blue-200 shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-gray-900 text-[14px] truncate group-hover:text-blue-600 transition-colors leading-tight">{student.name}</h3>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{student.className}</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === student.id ? null : student.id);
                                            }}
                                            className={`action-menu-trigger w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                activeMenuId === student.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                                        </button>

                                        {activeMenuId === student.id && (
                                            <div className="action-menu-container absolute right-0 top-10 w-52 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-200 z-[100] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                                <div className="p-1.5">
                                                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg mb-1.5">
                                                        Update Status
                                                    </div>
                                                    {[
                                                        { label: 'Current Student', value: 'CURRENT', icon: faUserCheck, color: 'text-emerald-600' },
                                                        { label: 'Alumni', value: 'ALUMNI', icon: faUserClock, color: 'text-blue-600' },
                                                        { label: 'Discontinued', value: 'DISCONTINUED', icon: faBan, color: 'text-amber-600' },
                                                        { label: 'Long Absent', value: 'LONG_ABSENT', icon: faUserSlash, color: 'text-red-500' },
                                                    ]
                                                    .filter(option => option.value !== student.status)
                                                    .map((option) => (
                                                        <button
                                                            key={option.value}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusUpdate(student.id, option.value);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={option.icon} className={`w-3 ${option.color}`} />
                                                            {option.label}
                                                        </button>
                                                    ))}

                                                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-lg mb-1.5">
                                                        Transport Service
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTransportStatusUpdate(
                                                                student.id, 
                                                                student.transportStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                                            );
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={student.transportStatus === 'ACTIVE' ? faWalking : faBus} 
                                                            className={`w-3 ${student.transportStatus === 'ACTIVE' ? 'text-amber-600' : 'text-emerald-600'}`} 
                                                        />
                                                        {student.transportStatus === 'ACTIVE' ? 'Stop Transport' : 'Start Transport'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 relative z-10">
                                    {/* Parent Info */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100/50 group-hover:bg-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faUserTie} className="text-[10px] text-gray-400 w-3" />
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Parent</p>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-800 truncate max-w-[100px]">{student.parentName}</span>
                                    </div>

                                    {/* Contact */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100/50 group-hover:bg-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faPhone} className="text-[10px] text-gray-400 w-3" />
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Contact</p>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-800">{student.mobile}</span>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100/50 group-hover:bg-white transition-all">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faClock} className="text-[10px] text-gray-400 w-3" />
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Joined</p>
                                        </div>
                                        <span className="text-[11px] font-black text-gray-800">{student.date}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${student.isTransport ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <FontAwesomeIcon icon={student.isTransport ? faBus : faWalking} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-gray-400">{student.isTransport ? 'Bus' : 'Day'}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${
                                        student.status === 'CURRENT' ? 'bg-emerald-500' :
                                        student.status === 'ALUMNI' ? 'bg-blue-500' :
                                        'bg-rose-500'
                                    }`}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100 text-center p-12">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 text-slate-200">
                            <FontAwesomeIcon icon={faUsers} className="text-4xl" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-2xl mb-2">No records found</h3>
                        <p className="text-slate-500 font-medium max-w-xs">We couldn't find any students matching your current selection or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDirectory;
