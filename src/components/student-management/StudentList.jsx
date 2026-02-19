import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEdit, faEye, faPhone, faChild, faCalendarDay, faUserTie, faEllipsisV, faUserSlash, faUserCheck, faUserClock, faBan, faBus, faWalking } from '@fortawesome/free-solid-svg-icons';

const StudentList = ({
    filteredStudents,
    setSelectedStudent,
    setShowForm,
    handleStatusUpdate,
    handleTransportStatusUpdate,
    activeMenuId,
    setActiveMenuId,
    onSelectionChanged,
    onEdit
}) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Column definitions for AG Grid
    const columnDefs = [
        {
            headerName: "Student Name",
            field: "name",
            flex: 1.5,
            minWidth: 220,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: (params) => (
                <div
                    className="flex items-center gap-3 w-full cursor-pointer group"
                    onClick={() => { setSelectedStudent(params.data); setShowForm(false); }}
                >
                    <div className="flex flex-col overflow-hidden">
                        <p className="font-semibold text-gray-900 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">View Profile</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            headerName: "Class",
            field: "className",
            flex: 0.8,
            minWidth: 100,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
            cellRenderer: (params) => (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[11px] border border-blue-100 shadow-sm uppercase tracking-wide whitespace-nowrap">
                    {params.value}
                </span>
            )
        },
        {
            headerName: "Parents",
            flex: 1.5,
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
            headerName: "Emergency Contact",
            field: "emergencyContact",
            flex: 1.2,
            minWidth: 150,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', fontSize: '13px' }
        },
        {
            headerName: "Academic Year",
            field: "studyYear",
            flex: 1.2,
            minWidth: 160,
            hide: isMobile, // Hide on mobile/tablet
            suppressColumnsToolPanel: true,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: (params) => (
                <div className="flex items-center gap-2 w-full" title={params.value}>
                    <FontAwesomeIcon icon={faCalendarDay} className="text-blue-400 text-xs shrink-0" />
                    <span className="text-sm font-medium text-gray-600 truncate">{params.value}</span>
                </div>
            )
        },
        {
            headerName: "ACTIONS",
            field: "id",
            width: 100,
            minWidth: 100,
            sortable: false,
            filter: false,
            pinned: 'right',
            suppressMovable: true,
            suppressSizeToFit: true,
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
                                    
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">
                                        Transport Service
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentStatus = params.data.originalData?.transport_status;
                                            handleTransportStatusUpdate(
                                                params.data.id, 
                                                currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                            );
                                            setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon 
                                            icon={params.data.originalData?.transport_status === 'ACTIVE' ? faWalking : faBus} 
                                            className={`w-4 ${params.data.originalData?.transport_status === 'ACTIVE' ? 'text-amber-600' : 'text-emerald-600'}`} 
                                        />
                                        {params.data.originalData?.transport_status === 'ACTIVE' ? 'Stop Transport' : 'Start Transport'}
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
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
            {/* Unified Table View for All Screen Sizes */}
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
                            rowData={filteredStudents}
                            columnDefs={columnDefs}
                            rowSelection={{ mode: 'multiRow', headerCheckbox: true, enableClickSelection: false }}
                            selectionColumnDef={{ 
                                width: 50, 
                                minWidth: 50, 
                                maxWidth: 50, 
                                pinned: 'left',
                                cellStyle: { 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                },
                                headerClass: 'ag-center-header',
                                headerComponentParams: {
                                    template: '<div class="ag-cell-label-container" role="presentation" style="display: flex; justify-content: center; align-items: center; width: 100%;"><span ref="eCheckbox" class="ag-header-select-all"></span></div>'
                                }
                            }}
                            context={{ activeMenuId, setActiveMenuId }}
                            getRowStyle={params => {
                                if (params.data.id === activeMenuId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 1 };
                            }}
                            onSelectionChanged={(params) => {
                                const selectedNodes = params.api.getSelectedNodes();
                                const selectedData = selectedNodes.map(node => node.data);
                                onSelectionChanged(selectedData);
                            }}
                            onGridReady={(params) => {
                                // On mobile/tablet, don't auto-size columns to allow horizontal scroll
                                if (window.innerWidth >= 1024) {
                                    params.api.sizeColumnsToFit();
                                }
                            }}
                            onGridSizeChanged={(params) => {
                                // Only auto-size on desktop
                                if (window.innerWidth >= 1024) {
                                    params.api.sizeColumnsToFit();
                                }
                            }}
                            defaultColDef={{
                                sortable: true,
                                filter: false,
                                resizable: true,
                                headerClass: "font-bold uppercase text-xs tracking-wide",
                            }}
                            rowHeight={window.innerWidth < 1024 ? 60 : 80}
                            headerHeight={window.innerWidth < 1024 ? 40 : 50}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            theme="legacy"
                            overlayNoRowsTemplate='<span class="p-4">No students found</span>'
                        />
                    </div>
                </div>
            <style>{`
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

export default StudentList;
