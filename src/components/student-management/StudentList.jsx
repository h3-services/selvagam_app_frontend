import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEllipsisV, faUserSlash, faUserCheck, faUserClock, faBan, faBus, faWalking, faRoute } from '@fortawesome/free-solid-svg-icons';

import '../../styles/agGridMobileStyles.css';

const StudentList = ({
    filteredStudents,
    setSelectedStudent,
    setShowForm,
    handleStatusUpdate,
    handleTransportStatusUpdate,
    activeMenuId,
    setActiveMenuId,
    onSelectionChanged
}) => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
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
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-[13px] font-black shadow-sm overflow-hidden border border-slate-100 transition-transform group-hover:scale-105">
                        {params.data.originalData?.student_photo_url ? (
                            <img 
                                src={params.data.originalData.student_photo_url} 
                                alt={params.data.name} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            (params.value || 'U').charAt(0)
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="font-light text-gray-950 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
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
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-light text-[11px] border border-blue-100 shadow-sm uppercase tracking-wide whitespace-nowrap">
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
                            <p className="font-light text-gray-950 truncate tracking-tight text-[12px] leading-none">
                                {p1}
                            </p>
                        </div>
                        {p2 && (
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                <p className="font-light text-gray-900 truncate tracking-tight text-[12px] leading-none">
                                    {p2}
                                </p>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            headerName: "Route & Bus",
            flex: 1.5,
            minWidth: 200,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: (params) => (
                <div className="flex flex-col justify-center py-2 h-full gap-1.5 max-w-full">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FontAwesomeIcon icon={faRoute} className="text-[10px] text-blue-500 shrink-0" />
                        <p className="font-semibold text-gray-900 truncate tracking-tight text-[11px] leading-none">
                            {params.data.routeName || 'No Route'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <FontAwesomeIcon icon={faBus} className="text-[10px] text-indigo-500 shrink-0" />
                        <p className="font-medium text-slate-500 truncate tracking-tight text-[11px] leading-none">
                            {params.data.busName || 'No Bus'}
                        </p>
                    </div>
                </div>
            )
        },
        {
            headerName: "Contact",
            field: "emergencyContact",
            flex: 1.2,
            minWidth: 150,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: '300', fontSize: '13px' }
        },

        {
            headerName: "ACTIONS",
            field: "id",
            width: 100,
            minWidth: 100,
            sortable: false,
            filter: false,
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
                            rowData={filteredStudents}
                            columnDefs={columnDefs}
                            rowSelection={{ mode: 'multiRow', headerCheckbox: true, enableClickSelection: false }}
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
                                const selectedData = selectedNodes.map(node => node.data);
                                onSelectionChanged(selectedData);
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
                            defaultColDef={{
                                sortable: true,
                                filter: false,
                                resizable: true,
                                headerClass: "font-black uppercase text-[12px] tracking-wider",
                            }}
                            rowHeight={isMobile ? 60 : 80}
                            headerHeight={isMobile ? 40 : 50}
                            pagination={true}
                            paginationPageSize={20}
                            paginationPageSizeSelector={[10, 20, 50, 100]}
                            suppressPaginationPanel={false}
                            paginateChildRows={true}
                            theme="legacy"
                            suppressRowTransform={true}
                            getRowStyle={params => {
                                if (params.data.id === activeMenuId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 'auto' };
                            }}
                            overlayNoRowsTemplate='<span class="p-4 font-light uppercase text-xs tracking-widest text-gray-300">No students found</span>'
                        />
                    </div>
                </div>
        </div>
    );
};

export default StudentList;
