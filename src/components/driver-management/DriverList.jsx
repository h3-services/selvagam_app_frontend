import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/agGridMobileStyles.css';
import { 
    faChevronRight, 
    faTrash, 
    faEllipsisV, 
    faUserCheck, 
    faUserClock, 
    faIdCard, 
    faPhone,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

const DriverList = ({
    filteredDrivers,
    setSelectedStudent: setSelectedDriver, // Prop name mismatch handling
    handleToggleStatus,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    viewMode,
    onSelectionChanged
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        rowData={filteredDrivers}
                        columnDefs={[
                            {
                                headerName: "Name",
                                field: "name",
                                flex: 1.8,
                                minWidth: 220,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-4 w-full cursor-pointer group"
                                        onClick={() => setSelectedDriver(params.data)}
                                    >
                                        <div className="flex flex-col justify-center min-w-0 overflow-hidden flex-1">
                                            <p className="font-light text-gray-950 leading-tight group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Contact",
                                field: "mobile",
                                flex: 1.5,
                                minWidth: 180,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faPhone} className="text-[10px] text-blue-300" />
                                            <span className="text-xs font-light text-gray-700 tracking-tight">{params.value || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-[10px] text-blue-300" />
                                            <span className="text-[10px] font-light text-gray-400 truncate max-w-[120px]">{params.data.email || 'NO_MAIL'}</span>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "License",
                                field: "licenseNumber",
                                flex: 1.2,
                                minWidth: 160,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faIdCard} className="text-blue-400 text-xs shrink-0" />
                                        <span className="text-xs font-light text-gray-700 tracking-tight uppercase">{params.value || 'PENDING'}</span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Vehicle",
                                field: "vehicleNumber",
                                flex: 1.5,
                                minWidth: 180,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-xs font-light text-gray-800 tracking-tight leading-none mb-1">{params.value || 'UNASSIGNED'}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[9px] font-light text-gray-400 uppercase tracking-widest">{params.data.route || 'BASE'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Status",
                                field: "status",
                                flex: 1,
                                minWidth: 140,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => {
                                    const status = (params.value || 'INACTIVE').toUpperCase();
                                    const config = {
                                        'ACTIVE': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
                                        'RESIGNED': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
                                        'INACTIVE': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' }
                                    }[status] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };

                                    return (
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-light uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                                            {params.value || 'Inactive'}
                                        </div>
                                    );
                                }
                            },
                            {
                                headerName: "Actions",
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
                                                            Status Protocol
                                                        </div>
                                                        {[
                                                            { label: 'Activate Duty', value: 'ACTIVE', icon: faUserCheck, color: 'text-emerald-600' },
                                                            { label: 'Suspend Duty', value: 'INACTIVE', icon: faUserClock, color: 'text-amber-500' },
                                                        ]
                                                        .filter(option => option.value !== (params.data.status || '').toUpperCase())
                                                        .map((option) => (
                                                            <button
                                                                key={option.value}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStatus(params.data.id, option.value);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={option.icon} className={`w-4 ${option.color}`} />
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                        
                                                        {viewMode === 'active' && (
                                                            <>
                                                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(params.data.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} className="w-4" />
                                                                    Archive Personnel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            }
                        ]}
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
                        getRowId={params => params.data.id}
                        onSelectionChanged={(params) => {
                            const selectedNodes = params.api.getSelectedNodes();
                            const selectedData = selectedNodes.map(node => node.data);
                            if (setActiveMenuId) setActiveMenuId(null);
                            onSelectionChanged(selectedData);
                        }}
                        suppressRowTransform={true}
                        getRowStyle={params => {
                            if (params.data.id === activeMenuId) {
                                return { zIndex: 999, overflow: 'visible' };
                            }
                            return { zIndex: 1 };
                        }}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            headerClass: "font-black uppercase text-[12px] tracking-wider",
                        }}
                        rowHeight={isMobile ? 60 : 80}
                        headerHeight={isMobile ? 40 : 50}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4 font-light uppercase text-xs tracking-widest text-gray-300">No personnel detected in registry</span>'
                        theme="legacy"
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

export default DriverList;
