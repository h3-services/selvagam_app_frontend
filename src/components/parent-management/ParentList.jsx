import React, { useState, useRef, useMemo, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/agGridMobileStyles.css';
import { faEdit, faTrash, faEllipsisV, faChild, faCheckCircle, faBan, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
            hide: isMobile,
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
            cellRenderer: params => (
                <div className="flex items-center justify-center h-full">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.data.parent_id);
                        }}
                        className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center text-sm shadow-sm border ${
                            isInactiveView 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                        }`}
                        title={isInactiveView ? 'Activate Account' : 'Deactivate Account'}
                    >
                        <FontAwesomeIcon icon={isInactiveView ? faCheckCircle : faTrash} />
                    </button>
                </div>
            )
        }
    ], [handleDelete, isInactiveView, activeMenuId, setActiveMenuId, isMobile]);

    const defaultColDef = {
        sortable: true,
        filter: false,
        resizable: true,
        headerClass: "font-bold uppercase text-xs tracking-wide",
    };

    return (
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onGridReady = (params) => {
        if (window.innerWidth >= 1024) {
            params.api.sizeColumnsToFit();
        }
    };

    const onGridSizeChanged = (params) => {
        if (window.innerWidth >= 1024) {
            params.api.sizeColumnsToFit();
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative w-full">
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
                {/* Unified Table View */}
                <div className="flex flex-col flex-1 bg-white rounded-none lg:rounded-3xl shadow-xl overflow-hidden p-0 lg:p-6 w-full">
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
                                headerClass: 'ag-center-header',
                                headerComponentParams: {
                                    template: '<div class="ag-cell-label-container" role="presentation" style="display: flex; justify-content: center; align-items: center; width: 100%;"><span ref="eCheckbox" class="ag-header-select-all"></span></div>'
                                }
                            }}
                            onSelectionChanged={(params) => {
                                const selectedNodes = params.api.getSelectedNodes();
                                onSelectionChanged(selectedNodes.map(node => node.data));
                            }}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            rowHeight={isMobile ? 60 : 80}
                            headerHeight={isMobile ? 40 : 50}
                            animateRows={true}
                            getRowStyle={params => {
                                if (params.data.parent_id === activeMenuId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 1 };
                            }}
                            theme="legacy"
                            overlayNoRowsTemplate='<span class="p-4">No parents found</span>'
                            onGridReady={onGridReady}
                            onGridSizeChanged={onGridSizeChanged}
                        />
                    </div>
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

                .custom-ag-grid .ag-pinned-right-header {
                    border-left: none !important;
                }
                .custom-ag-grid .ag-pinned-right-cols-container {
                    border-left: none !important;
                }
                .custom-ag-grid .ag-pinned-right-header::before,
                .custom-ag-grid .ag-pinned-right-cols-container::before {
                    display: none !important;
                }
                .custom-ag-grid .ag-cell {
                    border: none !important;
                }
                .custom-ag-grid .ag-header-cell {
                    border-right: none !important;
                }
                .custom-ag-grid .ag-root-wrapper {
                    border: none !important;
                }
                
                /* Center align checkbox column header */
                .custom-ag-grid .ag-header-select-all {
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .custom-ag-grid .ag-pinned-left-header .ag-header-cell-comp-wrapper {
                    justify-content: center;
                }
                
                .custom-ag-grid .ag-header-cell.ag-header-cell-sortable .ag-header-cell-comp-wrapper {
                    justify-content: center;
                }
                
                /* Mobile/Tablet Responsive Styles */
                @media (max-width: 1023px) {
                    .custom-ag-grid {
                        font-size: 12px;
                        border-radius: 0 !important;
                    }
                    
                    /* Header styles */
                    .custom-ag-grid .ag-header {
                        border-bottom: 2px solid #e5e7eb;
                    }
                    
                    .custom-ag-grid .ag-header-cell {
                        padding-left: 8px !important;
                        padding-right: 8px !important;
                        border-right: none !important;
                    }
                    
                    .custom-ag-grid .ag-header-cell-text {
                        font-size: 10px;
                        font-weight: 700;
                    }
                    
                    /* Row and cell styles */
                    .custom-ag-grid .ag-row {
                        border-bottom: 1px solid #f3f4f6;
                    }
                    
                    .custom-ag-grid .ag-cell {
                        padding-left: 8px !important;
                        padding-right: 8px !important;
                        line-height: 1.3;
                        border-right: none !important;
                    }
                    
                    /* Checkbox column alignment */
                    .custom-ag-grid .ag-selection-checkbox {
                        margin: 0 auto;
                    }
                    
                    .custom-ag-grid .ag-header-select-all {
                        margin: 0 auto;
                    }
                    
                    /* Checkbox column styling */
                    .custom-ag-grid .ag-pinned-left-cols-container .ag-cell {
                        border-right: none !important;
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                        justify-content: center;
                    }
                    
                    .custom-ag-grid .ag-pinned-left-header .ag-header-cell {
                        border-right: none !important;
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                    }
                    
                    /* Actions column styling */
                    .custom-ag-grid .ag-pinned-right-cols-container .ag-cell {
                        border-left: none !important;
                        border-right: none !important;
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                    }
                    
                    .custom-ag-grid .ag-pinned-right-header .ag-header-cell {
                        border-left: none !important;
                        border-right: none !important;
                        padding-left: 4px !important;
                        padding-right: 4px !important;
                    }
                    
                    /* Pagination styles */
                    .custom-ag-grid .ag-paging-panel {
                        font-size: 11px;
                        padding: 8px 6px;
                        border-top: 2px solid #e5e7eb;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                    
                    .custom-ag-grid .ag-paging-button {
                        min-width: 28px;
                        height: 28px;
                    }
                    
                    .custom-ag-grid .ag-paging-page-summary-panel {
                        order: -1;
                        width: 100%;
                        text-align: center;
                        margin-bottom: 6px;
                    }
                    
                    /* Enable horizontal scroll on mobile/tablet */
                    .custom-ag-grid .ag-body-horizontal-scroll-viewport {
                        overflow-x: auto !important;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    .custom-ag-grid .ag-body-viewport {
                        overflow-x: auto !important;
                    }
                    
                    /* Remove rounded corners on mobile */
                    .custom-ag-grid .ag-root-wrapper {
                        border-radius: 0 !important;
                    }
                    
                    /* Pinned columns styling */
                    .custom-ag-grid .ag-pinned-left-header,
                    .custom-ag-grid .ag-pinned-left-cols-container {
                        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
                    }
                    
                    .custom-ag-grid .ag-pinned-right-header,
                    .custom-ag-grid .ag-pinned-right-cols-container {
                        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
                    }
                    
                    /* Action button styling */
                    .custom-ag-grid .action-menu-trigger {
                        width: 32px;
                        height: 32px;
                    }
                }
                
                /* Extra small mobile devices */
                @media (max-width: 640px) {
                    .custom-ag-grid {
                        font-size: 11px;
                    }
                    
                    .custom-ag-grid .ag-header-cell-text {
                        font-size: 9px;
                    }
                    
                    .custom-ag-grid .ag-cell {
                        padding-left: 6px !important;
                        padding-right: 6px !important;
                        border-right: none !important;
                    }
                    
                    .custom-ag-grid .ag-header-cell {
                        padding-left: 6px !important;
                        padding-right: 6px !important;
                        border-right: none !important;
                    }
                    
                    .custom-ag-grid .ag-pinned-left-cols-container .ag-cell,
                    .custom-ag-grid .ag-pinned-right-cols-container .ag-cell {
                        padding-left: 3px !important;
                        padding-right: 3px !important;
                    }
                    
                    .custom-ag-grid .ag-pinned-left-header .ag-header-cell,
                    .custom-ag-grid .ag-pinned-right-header .ag-header-cell {
                        padding-left: 3px !important;
                        padding-right: 3px !important;
                    }
                    
                    .custom-ag-grid .ag-paging-panel {
                        font-size: 10px;
                        padding: 6px 4px;
                    }
                    
                    .custom-ag-grid .ag-paging-button {
                        min-width: 26px;
                        height: 26px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ParentList;

/* REMOVED MOBILE CARD VIEW - NOW USING TABLE ON ALL SCREEN SIZES */
/* REMOVED INLINE STYLES - NOW USING SHARED CSS FILE */
