import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight, 
    faTrash, 
    faEllipsisV, 
    faUserCheck, 
    faUserClock, 
    faIdCard, 
    faCar, 
    faCompass, 
    faPhone,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const DriverList = ({
    filteredDrivers,
    setSelectedStudent: setSelectedDriver, // Prop name mismatch handling
    handleToggleStatus,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    viewMode
}) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:flex lg:flex-col flex-1 bg-white rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden p-6 border border-slate-100">
                <div className="ag-theme-quartz w-full custom-ag-grid" style={{
                    height: '100%',
                    '--ag-header-background-color': '#f8fafc',
                    '--ag-header-foreground-color': '#1e293b',
                    '--ag-font-family': 'Outfit, sans-serif',
                    '--ag-border-radius': '24px',
                    '--ag-row-hover-color': '#f1f5f9',
                    '--ag-cell-horizontal-padding': '24px',
                }}>
                    <AgGridReact
                        rowData={filteredDrivers}
                        columnDefs={[
                            {
                                headerName: "Driver Identity",
                                field: "name",
                                flex: 1.5,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-4 w-full cursor-pointer group"
                                        onClick={() => setSelectedDriver(params.data)}
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500 shrink-0">
                                            {params.data.photo_url ? (
                                                <img src={params.data.photo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                (params.value || '?').charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors truncate">{params.value || 'Unknown'}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-all">View Identity</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-slate-200 group-hover:text-blue-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Terminal / Contact",
                                field: "mobile",
                                flex: 1.2,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faPhone} className="text-[10px] text-slate-300" />
                                            <span className="text-xs font-black text-slate-700 tracking-tight">{params.value || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-[10px] text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-400 truncate max-w-[120px]">{params.data.email || 'NO_MAIL'}</span>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Clearance ID",
                                field: "licenseNumber",
                                flex: 1,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm shrink-0">
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </div>
                                        <span className="text-xs font-black text-slate-800 tracking-tight uppercase">{params.value || 'PENDING'}</span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Fleet Assignment",
                                field: "vehicleNumber",
                                flex: 1.2,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                                            <FontAwesomeIcon icon={faCar} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 tracking-tight leading-none mb-1">{params.value || 'UNASSIGNED'}</p>
                                            <div className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCompass} className="text-[8px] text-slate-300" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{params.data.route || 'BASE'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Actions",
                                field: "id",
                                width: 80,
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
                                                className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center text-sm ${
                                                    isOpen ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </button>

                                            {isOpen && (
                                                <div className="absolute right-0 top-12 w-52 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[9999] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                                    <div className="p-2">
                                                        <div className="px-4 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 rounded-xl mb-1.5">
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
                                                                className="w-full text-left px-4 py-3 text-xs font-black text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all"
                                                            >
                                                                <FontAwesomeIcon icon={option.icon} className={`w-4 ${option.color}`} />
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                        
                                                        {viewMode === 'active' && (
                                                            <>
                                                                <div className="h-px bg-slate-50 my-1.5 mx-2" />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(params.data.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-all"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} className="w-4" />
                                                                    Retire Personnel
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
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            headerClass: "font-black uppercase text-[10px] tracking-[0.2em] text-slate-400",
                        }}
                        rowHeight={90}
                        headerHeight={60}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4 font-black uppercase text-[10px] tracking-widest text-slate-300">No personnel detected in registry</span>'
                        theme="legacy"
                        onGridReady={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-4 space-y-6 pb-24">
                {filteredDrivers.map((driver) => (
                    <div key={driver.id} 
                         onClick={() => setSelectedDriver(driver)}
                         className="relative bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden active:scale-95 transition-transform"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 bg-slate-50 group-hover:scale-110 transition-transform" />
                        <div className="relative p-6">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-2xl overflow-hidden">
                                    {driver.photo_url ? (
                                        <img src={driver.photo_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        driver.name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">{driver.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{driver.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Mobile</p>
                                    <p className="text-sm text-slate-900 font-black truncate tracking-tight">{driver.mobile}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">License</p>
                                    <p className="text-sm text-slate-900 font-black truncate tracking-tight">{driver.licenseNumber}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Vehicle</p>
                                    <p className="text-sm text-slate-900 font-black truncate tracking-tight">{driver.vehicleNumber}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                        driver.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                        driver.status === 'Resigned' ? 'text-red-600 bg-red-50' :
                                        'text-amber-600 bg-amber-50'
                                    }`}>
                                        {driver.status || 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DriverList;
