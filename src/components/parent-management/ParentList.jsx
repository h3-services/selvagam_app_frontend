import React, { useState, useRef, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/agGridMobileStyles.css';
import { faTrash, faCheckCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ParentList = ({ 
    filteredParents, 
    handleDelete,
    isInactiveView = false,
    onSelectionChanged,
    onViewParent
}) => {
    const gridRef = useRef();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Column Definitions
    const columnDefs = useMemo(() => [
        {
            headerName: 'Parent Name',
            field: 'name',
            flex: 1.5,
            minWidth: 200,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center gap-3 w-full cursor-pointer group" onClick={() => {
                   onViewParent(params.data);
                }}>
                    <div className="flex flex-col">
                        <p className="font-light text-gray-950 leading-tight group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Mobile',
            field: 'phone',
            flex: 1.2,
            minWidth: 150,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-950 font-light text-[13px] tracking-tight">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Students Linked',
            field: 'linkedStudents',
            flex: 1.5,
            minWidth: 180,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => {
                const students = params.value?.filter(s => s !== 'No children linked') || [];
                if (students.length === 0) {
                    return <span className="text-slate-300 text-[10px] font-light uppercase tracking-widest opacity-60">None Linked</span>;
                }
                
                return (
                    <div className="w-full max-h-[70px] overflow-y-auto custom-mini-scroll py-2 pr-2">
                        <div className="flex flex-col gap-1.5">
                            {students.map((student, idx) => (
                                <div key={idx} className="flex items-center gap-2 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                    <span className="text-[12px] font-light text-gray-950 tracking-tight whitespace-nowrap">
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
            flex: 0.8,
            minWidth: 90,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => {
                const classes = params.value || [];
                if (classes.length === 0) {
                    return <span className="text-slate-300 text-[10px] font-light uppercase tracking-widest opacity-60">N/A</span>;
                }
                
                return (
                    <div className="w-full max-h-[70px] overflow-y-auto custom-mini-scroll py-1 pr-2">
                        <div className="flex flex-wrap gap-1.5">
                            {classes.map((className, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-light text-[10px] sm:text-[11px] border border-blue-100 uppercase tracking-wide whitespace-nowrap shadow-sm">
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
            minWidth: 220,
            hide: isMobile && window.innerWidth < 640,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center min-w-0 w-full">
                    <span className="text-gray-950 font-light text-[12px] tracking-tight">
                        {[params.data.door_no, params.data.street].filter(Boolean).join(', ')}
                    </span>
                </div>
            )
        },
        {
            headerName: 'ACTIONS',
            field: 'parent_id',
            width: 80,
            minWidth: 80,
            sortable: false,
            filter: false,
            suppressMovable: true,
            suppressSizeToFit: true,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            cellRenderer: params => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.data.parent_id);
                        }}
                        className={`w-9 h-9 rounded-xl transition-all duration-300 active:scale-90 shadow-sm hover:shadow-lg flex items-center justify-center group ${
                            isInactiveView 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                                : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white'
                        }`}
                        title={isInactiveView ? 'Activate Parent' : 'Deactivate Parent'}
                    >
                        <FontAwesomeIcon 
                            icon={isInactiveView ? faCheckCircle : faTrash} 
                            className="text-[13px] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" 
                        />
                    </button>
                </div>
            )
        }
    ], [handleDelete, isInactiveView, onViewParent, isMobile]);

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full lg:bg-transparent">
            {/* Unified Table View for All Screen Sizes */}
            <div className="flex flex-col flex-1 overflow-hidden p-0 w-full">
                <div className="ag-theme-quartz w-full custom-ag-grid flex-1 overflow-hidden" style={{
                    height: 'calc(100vh - 165px)',
                    '--ag-header-background-color': '#f0f4ff',
                    '--ag-header-foreground-color': '#3b82f6',
                    '--ag-font-family': 'inherit',
                    '--ag-border-radius': '24px',
                    '--ag-row-hover-color': '#f1f5f9',
                }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={filteredParents}
                        columnDefs={columnDefs}
                        defaultColDef={{
                            sortable: true,
                            filter: false,
                            resizable: true,
                            headerClass: "font-black uppercase text-[12px] tracking-wider",
                        }}
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
                            headerClass: 'ag-center-header',
                            headerComponentParams: {
                                template: '<div class="ag-cell-label-container" role="presentation" style="display: flex; justify-content: center; align-items: center; width: 100%;"><span ref="eCheckbox" class="ag-header-select-all"></span></div>'
                            }
                        }}
                        onSelectionChanged={(params) => {
                            onSelectionChanged(params.api.getSelectedNodes().map(node => node.data));
                        }}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        rowHeight={isMobile ? 60 : 80}
                        headerHeight={isMobile ? 40 : 50}
                        animateRows={true}
                        suppressRowTransform={true}
                        getRowStyle={params => ({ zIndex: 1, overflow: 'visible' })}
                        theme="legacy"
                        overlayNoRowsTemplate='<span class="p-4 font-light uppercase text-xs tracking-widest text-gray-300">No parents found</span>'
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
                    />
                </div>
            </div>
        </div>
    );
};

export default ParentList;
