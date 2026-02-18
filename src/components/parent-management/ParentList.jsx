import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEllipsisV, faChild, faCheckCircle, faBan, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useMemo } from 'react';

const ParentList = ({ 
    filteredParents, 
    handleDelete,
    isInactiveView = false,
    activeMenuId,
    setActiveMenuId,
    onSelectionChanged,
    onViewParent
}) => {
    const gridRef = useRef();

    // Column Definitions
    const columnDefs = useMemo(() => [
        {
            headerName: 'Parent Name',
            field: 'name',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center gap-3 w-full cursor-pointer group" onClick={() => {
                   onViewParent(params.data);
                }}>
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 leading-none group-hover:text-blue-700 transition-colors tracking-tight">{params.value || 'Unknown'}</p>
                        <div className="flex items-center gap-1 mt-0">
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">View Details</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Mobile',
            field: 'phone',
            flex: 1.2,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-bold text-[13px] tracking-tight">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Students Linked',
            field: 'linkedStudents',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => {
                const students = params.value?.filter(s => s !== 'No children linked') || [];
                if (students.length === 0) {
                    return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">None Linked</span>;
                }
                
                return (
                    <div className="w-full max-h-[70px] overflow-y-auto custom-mini-scroll py-1 pr-2">
                        <div className="flex flex-col gap-1.5">
                            {students.map((student, idx) => (
                                <div key={idx} className="flex items-center gap-2 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                    <span className="text-[12px] font-bold text-slate-800 tracking-tight whitespace-nowrap">
                                        {student.name || student}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        },
        {
            headerName: 'Classes',
            field: 'childClasses',
            width: 160,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => {
                const classes = params.value || [];
                if (classes.length === 0) {
                    return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">N/A</span>;
                }
                
                return (
                    <div className="w-full max-h-[70px] overflow-y-auto custom-mini-scroll py-1 pr-2">
                        <div className="flex flex-wrap gap-1.5">
                            {classes.map((className, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg font-bold text-[10px] border border-blue-100 uppercase tracking-wider whitespace-nowrap shadow-sm">
                                    {className}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            }
        },
        {
            headerName: 'Address',
            field: 'street',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex flex-col justify-center min-w-0">
                    <span className="text-slate-700 font-bold text-[12px] tracking-tight truncate">{params.data.street}</span>
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">{params.data.city}</span>
                </div>
            )
        },
        {
            headerName: 'ACTIONS',
            field: 'parent_id',
            width: 80,
            pinned: 'right',
            sortable: false,
            filter: false,
            cellStyle: { overflow: 'visible' },
            cellRenderer: params => {
                const isOpen = activeMenuId === params.data.parent_id;
                return (
                    <div className="relative flex items-center justify-center h-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isOpen ? null : params.data.parent_id);
                            }}
                            className={`action-menu-trigger w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm ${
                                isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {isOpen && (
                            <div className="action-menu-container absolute right-4 top-10 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="p-1">
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">
                                        Account Actions
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewParent(params.data);
                                            setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="w-4 text-blue-600" />
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(params.data.parent_id);
                                            setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={isInactiveView ? faCheckCircle : faTrash} className={`w-4 ${isInactiveView ? 'text-emerald-600' : 'text-red-600'}`} />
                                        {isInactiveView ? 'Activate Account' : 'Deactivate Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }
    ], [handleDelete, isInactiveView, activeMenuId, setActiveMenuId]);

    const defaultColDef = {
        sortable: true,
        filter: false,
        resizable: true,
        headerClass: "font-bold uppercase text-xs tracking-wide",
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden relative">
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
                            ref={gridRef}
                            rowData={filteredParents}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection={{ 
                                mode: 'multiRow', 
                                headerCheckbox: true, 
                                enableClickSelection: false 
                            }}
                            selectionColumnDef={{ 
                                width: 50, 
                                minWidth: 50, 
                                maxWidth: 50, 
                                pinned: 'left',
                                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                                headerClass: 'ag-center-header'
                            }}
                            onSelectionChanged={(params) => {
                                const selectedNodes = params.api.getSelectedNodes();
                                onSelectionChanged(selectedNodes.map(node => node.data));
                            }}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            rowHeight={80}
                            headerHeight={50}
                            animateRows={true}
                            getRowStyle={params => {
                                if (params.data.parent_id === activeMenuId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 1 };
                            }}
                            theme="legacy"
                            overlayNoRowsTemplate='<span class="p-4">No parents found</span>'
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredParents.map((parent) => (
                        <div 
                            key={parent.parent_id} 
                            className="relative bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-[0.03]" style={{ backgroundColor: '#3A7BFF' }}></div>
                            
                            <div className="relative p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100" style={{ backgroundColor: '#3A7BFF' }}>
                                            {parent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 text-[17px] leading-tight">{parent.name}</h3>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">Parent Account</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(parent.parent_id)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                isInactiveView ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={isInactiveView ? faCheckCircle : faTrash} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FontAwesomeIcon icon={faChild} className="text-[10px] text-blue-500" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Children</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {parent.linkedStudents?.map((s, i) => (
                                                <span key={i} className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                                                    {s === 'No children linked' ? 'None' : (s.name || s)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-2 text-blue-500">
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${
                                            parent.parents_active_status === 'ACTIVE' ? 'text-emerald-600' : 'text-amber-600'
                                        }`}>
                                            {parent.parents_active_status || 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Details</p>
                                                <p className="text-[13px] font-bold text-slate-900">{parent.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                                <p className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{parent.street}, {parent.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onViewParent(parent)}
                                    className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[13px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
                                >
                                    Manage Account
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .custom-mini-scroll::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-mini-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-mini-scroll::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-mini-scroll::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
                .custom-ag-grid .ag-pinned-right-header { border-left: none !important; }
                .custom-ag-grid .ag-pinned-right-cols-container { border-left: none !important; }
                .custom-ag-grid .ag-pinned-right-header::before, .custom-ag-grid .ag-pinned-right-cols-container::before { display: none !important; }
                .custom-ag-grid .ag-cell { border: none !important; }
                .custom-ag-grid .ag-root-wrapper { border: none !important; }
            `}</style>
        </div>
    );
};

export default ParentList;
