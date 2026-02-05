import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronRight, faEye, faPhone, faChild, faRoute, faUserTie } from '@fortawesome/free-solid-svg-icons';

const StudentList = ({
    filteredStudents,
    setSelectedStudent,
    setShowForm,
    handleDelete,
    activeMenuId,
    setActiveMenuId
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <div className="flex-1 overflow-hidden h-full flex flex-col">
                {/* Desktop/Tablet Table View */}
                <div className="hidden lg:flex lg:flex-col w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6 h-full">
                    <div className="ag-theme-quartz w-full flex-1" style={{
                        minHeight: 0,
                        '--ag-header-background-color': '#f8f5ff',
                        '--ag-header-foreground-color': '#40189d',
                        '--ag-font-family': 'inherit',
                        '--ag-border-radius': '16px',
                        '--ag-row-hover-color': '#faf5ff',
                    }}>
                        <AgGridReact
                            rowData={filteredStudents}
                            columnDefs={[
                                {
                                    headerName: "Student Name",
                                    field: "name",
                                    flex: 1.5,
                                    cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                    cellRenderer: (params) => (
                                        <div
                                            className="flex items-center gap-3 w-full cursor-pointer group"
                                            onClick={() => { setSelectedStudent(params.data); setShowForm(false); }}
                                        >
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#40189d' }}>
                                                {params.value.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value}</p>
                                                <div className="flex items-center gap-1 -mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">View Details</span>
                                                    <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-purple-600 transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    headerName: "Parents",
                                    flex: 1.5,
                                    cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#374151' },
                                    valueGetter: (params) => {
                                        const p1 = params.data.parent1Name;
                                        const p2 = params.data.parent2Name;
                                        return p2 ? `${p1}, ${p2}` : p1;
                                    }
                                },
                                {
                                    headerName: "Mobile",
                                    field: "mobile",
                                    flex: 1,
                                    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: '500' }
                                },
                                {
                                    headerName: "Location",
                                    field: "location",
                                    flex: 1.5,
                                    cellStyle: { display: 'flex', alignItems: 'center' },
                                    cellRenderer: (params) => (
                                        <div className="flex items-center gap-2 truncate" title={params.value}>
                                            <FontAwesomeIcon icon={faRoute} className="text-purple-400 text-xs shrink-0" />
                                            <span className="text-sm text-gray-600 truncate">{params.value}</span>
                                        </div>
                                    )
                                },
                                {
                                    headerName: "ACTIONS",
                                    field: "id",
                                    width: 100,
                                    sortable: false,
                                    filter: false,
                                    cellStyle: { overflow: 'visible' },
                                    cellRenderer: (params) => {
                                        return (
                                            <div className="flex items-center justify-center h-full relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(params.data.id);
                                                    }}
                                                    className="w-8 h-8 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center text-sm"
                                                    title="Recycle Bin"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
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
                            paginationPageSize={5}
                            paginationPageSizeSelector={[5, 10, 20, 50]}
                            overlayNoRowsTemplate='<span class="p-4">No students found</span>'
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredStudents.map((student, index) => (
                        <div key={student.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#40189d' }}></div>
                            <div className="relative p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{student.name}</h3>
                                            <p className="text-xs font-medium" style={{ color: '#40189d' }}>{student.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faUserTie} className="text-xs" style={{ color: '#40189d' }} />
                                            <p className="text-xs text-gray-500 font-medium">Parents</p>
                                        </div>
                                        <p className="text-sm text-gray-900 font-bold truncate">{student.parent1Name}</p>
                                        {student.parent2Name && <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{student.parent2Name}</p>}
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#40189d' }} />
                                            <p className="text-xs text-gray-500 font-medium">Mobile</p>
                                        </div>
                                        <p className="text-sm text-gray-900 font-bold truncate">{student.mobile}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setSelectedStudent(student); setShowForm(false); }}
                                    className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                    style={{ backgroundColor: '#40189d' }}
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
