import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight, 
    faTrash, 
    faEllipsisV, 
    faUserCheck, 
    faUserClock, 
    faIdCard, 
    faPhone,
    faEnvelope,
    faEdit,
    faIdBadge
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
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Desktop Table View */}
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
                                            <p className="font-semibold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors truncate">{params.value || 'Unknown'}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">View Identity</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-200 group-hover:text-blue-500 transition-colors" />
                                            </div>
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
                                            <span className="text-xs font-bold text-gray-700 tracking-tight">{params.value || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-[10px] text-blue-300" />
                                            <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">{params.data.email || 'NO_MAIL'}</span>
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
                                        <span className="text-xs font-bold text-gray-700 tracking-tight uppercase">{params.value || 'PENDING'}</span>
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
                                            <p className="text-xs font-bold text-gray-800 tracking-tight leading-none mb-1">{params.value || 'UNASSIGNED'}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{params.data.route || 'BASE'}</span>
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
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
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
                            headerClass: 'ag-center-header'
                        }}
                        getRowId={params => params.data.id}
                        onSelectionChanged={(params) => {
                            const selectedNodes = params.api.getSelectedNodes();
                            const selectedData = selectedNodes.map(node => node.data);
                            if (setActiveMenuId) setActiveMenuId(null);
                            onSelectionChanged(selectedData);
                        }}
                        getRowStyle={params => {
                            if (params.data.id === activeMenuId) {
                                return { zIndex: 999, overflow: 'visible' };
                            }
                            return { zIndex: 1 };
                        }}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            headerClass: "font-bold uppercase text-xs tracking-wide",
                        }}
                        rowHeight={80}
                        headerHeight={50}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4 font-bold uppercase text-xs tracking-widest text-gray-300">No personnel detected in registry</span>'
                        theme="legacy"
                        onGridReady={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                        onGridSizeChanged={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </div>
            </div>

            {/* Selection Overrides */}
            <style dangerouslySetInnerHTML={{ __html: `
                .ag-center-header .ag-header-cell-comp-wrapper {
                    justify-content: center !important;
                }
                .ag-selection-checkbox {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 100% !important;
                    cursor: pointer !important;
                }
                .ag-checkbox-input-wrapper {
                    cursor: pointer !important;
                    width: 20px !important;
                    height: 20px !important;
                }
                .ag-center-header .ag-header-cell-label {
                     justify-content: center !important;
                }
                .custom-ag-grid .ag-pinned-right-header { border-left: none !important; }
                .custom-ag-grid .ag-pinned-right-cols-container { border-left: none !important; }
                .custom-ag-grid .ag-pinned-right-header::before, .custom-ag-grid .ag-pinned-right-cols-container::before { display: none !important; }
                .custom-ag-grid .ag-cell { border: none !important; }
                .custom-ag-grid .ag-root-wrapper { border: none !important; }
            ` }} />

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-4 space-y-6 pb-24">
                {filteredDrivers.map((driver) => (
                    <div key={driver.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-50">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#3A7BFF' }}></div>
                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#3A7BFF' }}>
                                        {driver.photo_url ? (
                                            <img src={driver.photo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            driver.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{driver.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel ID: {driver.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Contact</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{driver.mobile}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faIdCard} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">License</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{driver.licenseNumber}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faIdBadge} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vehicle</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{driver.vehicleNumber || 'UNASSIGNED'}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faUserClock} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</p>
                                    </div>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        (driver.status || '').toLowerCase() === 'active' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : (driver.status || '').toLowerCase() === 'resigned'
                                        ? 'text-red-600 bg-red-50 border-red-100'
                                        : 'text-amber-600 bg-amber-50 border-amber-100'
                                    }`}>
                                        {driver.status || 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedDriver(driver)}
                                className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                style={{ backgroundColor: '#3A7BFF' }}
                            >
                                <FontAwesomeIcon icon={faIdBadge} /> View Full Identity
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverList;
