import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEye, faPhone, faChild, faRoute, faUserTie, faEllipsisV, faUserSlash, faUserCheck, faUserClock, faBan, faBus, faWalking } from '@fortawesome/free-solid-svg-icons';

const StudentList = ({
    filteredStudents,
    setSelectedStudent,
    setShowForm,
    handleStatusUpdate,
    handleTransportStatusUpdate,
    activeMenuId,
    setActiveMenuId
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Desktop/Tablet Table View */}
                <div className="hidden lg:flex lg:flex-col flex-1 bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                    <div className="ag-theme-quartz w-full custom-ag-grid" style={{
                        height: 'calc(100vh - 140px)',
                        '--ag-header-background-color': '#f0f4ff',
                        '--ag-header-foreground-color': '#3A7BFF',
                        '--ag-font-family': 'inherit',
                        '--ag-border-radius': '16px',
                        '--ag-row-hover-color': '#f5f8ff',
                    }}>
                        <AgGridReact
                            rowData={filteredStudents}
                            columnDefs={[
                                {
                                    headerName: "Student Name",
                                    field: "name",
                                    flex: 1.0,
                                    minWidth: 150,
                                    cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                    cellRenderer: (params) => (
                                        <div
                                            className="flex items-center gap-3 w-full cursor-pointer group"
                                            onClick={() => { setSelectedStudent(params.data); setShowForm(false); }}
                                        >
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#3A7BFF' }}>
                                                {params.value ? params.value.charAt(0) : '?'}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <p className="font-bold text-gray-900 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                                                <div className="flex items-center gap-1 -mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">View Details</span>
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
                                    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
                                    cellRenderer: (params) => (
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs border border-blue-100 shadow-sm uppercase tracking-wide whitespace-nowrap">
                                            {params.value}
                                        </span>
                                    )
                                },
                                {
                                    headerName: "Parents",
                                    flex: 1.2,
                                    minWidth: 180,
                                    cellStyle: { display: 'flex', alignItems: 'center' },
                                    cellRenderer: (params) => {
                                        const p1 = params.data.parent1Name;
                                        const p2 = params.data.parent2Name;
                                        return (
                                            <div className="flex flex-col justify-center py-2 h-full gap-1.5 max-w-full">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                                    <p className="font-bold text-gray-950 truncate tracking-tight text-[12px] leading-none">
                                                        {p1}
                                                    </p>
                                                </div>
                                                {p2 && (
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                                        <p className="font-bold text-gray-900 truncate tracking-tight text-[12px] leading-none">
                                                            {p2}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                },
                                {
                                    headerName: "Parent Mobile",
                                    field: "mobile",
                                    width: 140,
                                    minWidth: 140,
                                    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: '500' }
                                },
                                {
                                    headerName: "Transport",
                                    field: "originalData.is_transport_user",
                                    width: 130,
                                    minWidth: 130,
                                    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                                    cellRenderer: (params) => (
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                                            params.value 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                            <FontAwesomeIcon icon={params.value ? faBus : faWalking} className="text-[10px]" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {params.value ? 'Bus' : 'None'}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    headerName: "Location",
                                    field: "location",
                                    flex: 1.5,
                                    minWidth: 180,
                                    cellStyle: { display: 'flex', alignItems: 'center' },
                                    cellRenderer: (params) => (
                                        <div className="flex items-center gap-2 w-full" title={params.value}>
                                            <FontAwesomeIcon icon={faRoute} className="text-blue-400 text-xs shrink-0" />
                                            <span className="text-sm text-gray-600 truncate">{params.value}</span>
                                        </div>
                                    )
                                },
                                {
                                    headerName: "ACTIONS",
                                    field: "id",
                                    width: 90,
                                    minWidth: 90,
                                    sortable: false,
                                    filter: false,
                                    pinned: 'right',
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
                                                            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">
                                                                Status Updates
                                                            </div>
                                                            {[
                                                                { label: 'Current Student', value: 'CURRENT', icon: faUserCheck, color: 'text-emerald-600' },
                                                                { label: 'Alumni', value: 'ALUMNI', icon: faUserClock, color: 'text-blue-600' },
                                                                { label: 'Discontinued', value: 'DISCONTINUED', icon: faBan, color: 'text-amber-600' },
                                                                { label: 'Long Absent', value: 'LONG_ABSENT', icon: faUserSlash, color: 'text-red-500' },
                                                            ]
                                                            .filter(option => option.value !== params.data.studentStatus)
                                                            .map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusUpdate(params.data.id, option.value);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <FontAwesomeIcon icon={option.icon} className={`w-4 ${option.color}`} />
                                                                    {option.label}
                                                                </button>
                                                            ))}
                                                            
                                                            <div className="h-px bg-gray-100 my-1" />
                                                            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">
                                                                Transport Service
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTransportStatusUpdate(
                                                                        params.data.id, 
                                                                        params.data.originalData?.is_transport_user ? 'INACTIVE' : 'ACTIVE'
                                                                    );
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                                            >
                                                                <FontAwesomeIcon 
                                                                    icon={params.data.originalData?.is_transport_user ? faWalking : faBus} 
                                                                    className={`w-4 ${params.data.originalData?.is_transport_user ? 'text-amber-600' : 'text-emerald-600'}`} 
                                                                />
                                                                {params.data.originalData?.is_transport_user ? 'Disable Transport' : 'Enable Transport'}
                                                            </button>
                                                            
                                                            <div className="h-px bg-gray-100 my-1" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                }
                            ]}
                            context={{ activeMenuId, setActiveMenuId }}
                            getRowStyle={params => {
                                if (params.data.id === activeMenuId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 1 };
                            }}
                            defaultColDef={{
                                sortable: true,
                                filter: false,
                                resizable: true,
                                headerClass: "font-bold uppercase text-xs tracking-wide",
                            }}
                            rowHeight={80}
                            headerHeight={50}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            theme="legacy"
                            overlayNoRowsTemplate='<span class="p-4">No students found</span>'
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredStudents.map((student, index) => (
                        <div key={student.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#3A7BFF' }}></div>
                            <div className="relative p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#3A7BFF' }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{student.name}</h3>
                                            <p className="text-xs font-medium" style={{ color: '#3A7BFF' }}>{student.date}</p>
                                        </div>
                                    </div>
                                    </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faUserTie} className="text-xs" style={{ color: '#3A7BFF' }} />
                                            <p className="text-xs text-gray-500 font-medium">Parents</p>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-sm text-gray-900 font-bold truncate">{student.parent1Name}</p>
                                            {student.parent2Name && <p className="text-xs text-gray-500 font-medium truncate">{student.parent2Name}</p>}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#3A7BFF' }} />
                                            <p className="text-xs text-gray-500 font-medium">Parent Mobile</p>
                                        </div>
                                        <p className="text-sm text-gray-900 font-bold truncate">{student.mobile}</p>
                                    </div>
                                    <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f0f4ff' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faChild} className="text-xs" style={{ color: '#3A7BFF' }} />
                                            <p className="text-xs text-gray-500 font-medium">Class / Section</p>
                                        </div>
                                        <p className="text-sm text-gray-900 font-bold">{student.className}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setSelectedStudent(student); setShowForm(false); }}
                                    className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                    style={{ backgroundColor: '#3A7BFF' }}
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-2" /> View Full Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentList;
