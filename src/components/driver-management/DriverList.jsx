import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';

const DriverList = ({
    filteredDrivers,
    setSelectedDriver,
    handleToggleStatus,
    handleDelete,
    activeMenuId,
    setActiveMenuId
}) => {
    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:flex lg:flex-col flex-1 bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                <div className="ag-theme-quartz w-full custom-ag-grid" style={{
                    height: 'calc(100vh - 140px)',
                    '--ag-header-background-color': '#f8f5ff',
                    '--ag-header-foreground-color': '#40189d',
                    '--ag-font-family': 'inherit',
                    '--ag-border-radius': '16px',
                    '--ag-row-hover-color': '#faf5ff',
                }}>
                    <AgGridReact
                        rowData={filteredDrivers}
                        columnDefs={[
                            {
                                headerName: "Driver Name",
                                field: "name",
                                flex: 1.5,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-start gap-3 w-full cursor-pointer group"
                                        onClick={() => setSelectedDriver(params.data)}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110 flex-shrink-0" style={{ backgroundColor: '#40189d' }}>
                                            {params.value ? params.value.charAt(0) : '?'}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value || 'Unknown'}</p>
                                            <div className="flex items-center gap-1 -mt-0.5">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">View Details</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text--[8px] text-gray-300 group-hover:text-purple-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Mobile",
                                field: "mobile",
                                flex: 1,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
                            },
                            {
                                headerName: "Vehicle",
                                field: "vehicleNumber",
                                flex: 1.5,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center' }
                            },
                            {
                                headerName: "Route",
                                field: "route",
                                flex: 1.5,
                                filter: false,
                                cellStyle: { display: 'flex', alignItems: 'center' }
                            },
                            {
                                headerName: "Status",
                                field: "status",
                                flex: 1,
                                filter: false, // Disabled filter
                                cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                        params.value === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                                            : 'bg-slate-50 text-slate-500 ring-1 ring-slate-100'
                                    }`}>
                                        {params.value || 'Inactive'}
                                    </span>
                                )
                            },
                            {
                                headerName: "Actions",
                                field: "id",
                                width: 100,
                                sortable: false,
                                filter: false,
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center justify-center h-full">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(params.data.id);
                                            }}
                                            className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
                                            title="Delete Driver"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
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
                        overlayNoRowsTemplate='<span class="p-4">No drivers found</span>'
                    />
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-1 space-y-4 pb-24">
                {filteredDrivers.map((driver) => (
                    <div key={driver.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{driver.name}</h3>
                                        <p className="text-xs font-medium text-gray-500">{driver.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(driver.id)}
                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Mobile</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{driver.mobile}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-1">License</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{driver.licenseNumber}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        driver.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'
                                    }`}>
                                        {driver.status || 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Vehicle</p>
                                    <p className="text-xs text-gray-900 font-medium truncate">{driver.vehicleNumber}</p>
                                </div>
                                <div 
                                    className="p-3 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors"
                                    style={{ border: '1px solid #e0e7ff', backgroundColor: 'white' }}
                                    onClick={() => setSelectedDriver(driver)}
                                >
                                    <span className="text-xs font-bold text-indigo-600 flex items-center">
                                        View Details <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-[10px]" />
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
