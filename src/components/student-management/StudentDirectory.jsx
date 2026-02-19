import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/agGridMobileStyles.css';
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
            // Fetch data with individual error handling to prevent 500s from blocking the whole view
            const [studentData, parentData, classData] = await Promise.all([
                studentService.getAllStudents().catch(err => {
                    console.error("Failed to fetch students:", err);
                    return [];
                }),
                parentService.getAllParents().catch(err => {
                    console.error("Failed to fetch parents:", err);
                    return [];
                }),
                classService.getAllClasses().catch(err => {
                    console.error("Failed to fetch classes:", err);
                    return [];
                })
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

    const columnDefs = [
        {
            headerName: "Student Name",
            field: "name",
            flex: 1.0,
            minWidth: 200,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: (params) => (
                <div className="flex items-center gap-3 w-full group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-light shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#3A7BFF' }}>
                        {params.value ? params.value.charAt(0) : '?'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="font-light text-gray-900 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                        <div className="flex items-center gap-1 -mt-1">
                            <span className="text-[10px] font-light text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Archive Record</span>
                            <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: "Class",
            field: "className",
            width: 110,
            minWidth: 110,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%' },
            cellRenderer: (params) => (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-light text-xs border border-blue-100 shadow-sm uppercase tracking-wide whitespace-nowrap">
                    {params.value}
                </span>
            )
        },
        {
            headerName: "Parents",
            field: "parentName",
            flex: 1.2,
            minWidth: 180,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: (params) => (
                <div className="flex flex-col justify-center py-2 h-full gap-1.5 max-w-full">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <p className="font-light text-gray-950 truncate tracking-tight text-[12px] leading-none">
                            {params.value}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FontAwesomeIcon icon={faPhone} className="text-[10px] text-gray-400 w-3" />
                        <p className="text-[11px] font-medium text-gray-500 truncate leading-none">
                            {params.data.mobile}
                        </p>
                    </div>
                </div>
            )
        },
        {
            headerName: "Status",
            field: "status",
            width: 130,
            minWidth: 130,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: (params) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-light uppercase tracking-widest text-white ${
                    params.value === 'CURRENT' ? 'bg-emerald-500' :
                    params.value === 'ALUMNI' ? 'bg-blue-500' :
                    'bg-rose-500'
                }`}>
                    {params.value}
                </span>
            )
        },
        {
            headerName: "Service",
            field: "transportStatus",
            width: 110,
            minWidth: 110,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${params.data.isTransport ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <FontAwesomeIcon icon={params.data.isTransport ? faBus : faWalking} />
                    </div>
                    <span className="text-[10px] font-light uppercase text-gray-400">{params.data.isTransport ? 'Bus' : 'Day'}</span>
                </div>
            )
        },
        {
            headerName: "Actions",
            width: 90,
            sortable: false,
            filter: false,

            cellStyle: { overflow: 'visible' },
            cellRenderer: (params) => {
                const isOpen = activeMenuId === params.data.id;
                return (
                    <div className="relative flex items-center justify-center h-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isOpen ? null : params.data.id);
                            }}
                            className={`action-menu-trigger w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm ${
                                isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {isOpen && (
                            <div className="action-menu-container absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="p-1">
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1 flex items-center justify-between">
                                        <span>Status Protocol</span>
                                    </div>
                                    {[
                                        { label: 'Current Student', value: 'CURRENT', icon: faUserCheck, color: 'text-emerald-600' },
                                        { label: 'Alumni', value: 'ALUMNI', icon: faUserClock, color: 'text-blue-600' },
                                        { label: 'Discontinued', value: 'DISCONTINUED', icon: faBan, color: 'text-amber-600' },
                                        { label: 'Long Absent', value: 'LONG_ABSENT', icon: faUserSlash, color: 'text-red-500' },
                                    ]
                                    .filter(option => option.value !== params.data.status)
                                    .map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(params.data.id, option.value);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={option.icon} className={`w-4 ${option.color}`} />
                                            {option.label}
                                        </button>
                                    ))}
                                    
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1 mt-1">
                                        Transport
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTransportStatusUpdate(
                                                params.data.id, 
                                                params.data.transportStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                            );
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon 
                                            icon={params.data.transportStatus === 'ACTIVE' ? faWalking : faBus} 
                                            className={`w-4 ${params.data.transportStatus === 'ACTIVE' ? 'text-amber-600' : 'text-emerald-600'}`} 
                                        />
                                        {params.data.transportStatus === 'ACTIVE' ? 'Stop Transport' : 'Start Transport'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30 mobile-full-width-container">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="ml-20 lg:ml-0">
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

            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col mobile-full-width-container">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden mobile-full-width-table">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faUsers} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Accessing Archives...</p>
                        </div>
                    ) : (
                        <div className="ag-theme-quartz w-full custom-ag-grid flex-1 overflow-hidden" style={{
                            height: 'calc(100vh - 165px)',
                            '--ag-header-background-color': '#f0f4ff',
                            '--ag-header-foreground-color': '#3b82f6',
                            '--ag-font-family': 'inherit',
                            '--ag-border-radius': '24px',
                            '--ag-row-hover-color': '#f1f5f9',
                        }}>
                            <AgGridReact
                                rowData={filteredStudents}
                                columnDefs={columnDefs}
                                defaultColDef={{
                                    sortable: true,
                                    resizable: true,
                                    headerClass: "font-black uppercase text-xs tracking-wide",
                                }}
                                rowHeight={window.innerWidth < 1024 ? 60 : 80}
                                headerHeight={window.innerWidth < 1024 ? 40 : 50}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 20, 50]}
                                theme="legacy"
                                suppressRowTransform={true}
                                rowSelection={{ mode: 'multiRow', headerCheckbox: true, enableClickSelection: false }}
                                selectionColumnDef={{ 
                                    width: 50, 
                                    minWidth: 50, 
                                    maxWidth: 50, 
                                    pinned: 'left',
                                    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                                    headerClass: 'ag-center-header'
                                }}
                                onGridReady={(params) => {
                                    if (window.innerWidth >= 1024) {
                                        params.api.sizeColumnsToFit();
                                    }
                                }}
                                onGridSizeChanged={(params) => {
                                    if (window.innerWidth >= 1024) {
                                        params.api.sizeColumnsToFit();
                                    }
                                }}
                                getRowStyle={params => {
                                    if (params.data.id === activeMenuId) {
                                        return { zIndex: 999, overflow: 'visible' };
                                    }
                                    return { zIndex: 1 };
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDirectory;

/* REMOVED INLINE STYLES - NOW USING SHARED CSS FILE */
