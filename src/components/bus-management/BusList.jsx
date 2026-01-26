import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrash, faCheck, faTimes, faEye, faChevronRight, faRoute, faUser, faUserFriends, faPhone, faWrench } from '@fortawesome/free-solid-svg-icons';
import { CiMenuKebab } from "react-icons/ci";

const BusList = ({
    filteredBuses,
    setSelectedBus,
    handleStatusChange,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    getStatusColor
}) => {
    return (
        <div className="flex-1 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                <div className="ag-theme-quartz w-full" style={{
                    height: 'calc(100vh - 220px)',
                    '--ag-header-background-color': '#f8f5ff',
                    '--ag-header-foreground-color': '#40189d',
                    '--ag-font-family': 'inherit',
                    '--ag-border-radius': '16px',
                    '--ag-row-hover-color': '#faf5ff',
                }}>
                    <AgGridReact
                        rowData={filteredBuses}
                        columnDefs={[
                            {
                                headerName: "Bus Number",
                                field: "busNumber",
                                flex: 1,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-3 w-full cursor-pointer group"
                                        onClick={() => setSelectedBus(params.data)}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#40189d' }}>
                                            <FontAwesomeIcon icon={faBus} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">View Details</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-purple-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Driver Name",
                                field: "driverName",
                                flex: 1.2,
                                cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
                            },
                            {
                                headerName: "Route",
                                field: "route",
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
                                headerName: "Status",
                                field: "status",
                                flex: 1,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(params.value)}`}>
                                            {params.value}
                                        </span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Actions",
                                field: "id",
                                width: 100,
                                sortable: false,
                                filter: false,
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => {
                                    const rowsPerPage = params.api.paginationGetPageSize();
                                    const indexOnPage = params.node.rowIndex % rowsPerPage;
                                    const totalRows = params.api.getDisplayedRowCount();
                                    const isLastRows = totalRows > 2 && (indexOnPage >= rowsPerPage - 2 || params.node.rowIndex >= totalRows - 2);
                                    return (
                                        <div className="flex items-center justify-center h-full relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentId = params.context.activeMenuId;
                                                    const clickedId = params.data.id;
                                                    params.context.setActiveMenuId(currentId === clickedId ? null : clickedId);
                                                }}
                                                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center text-xl ${params.context.activeMenuId === params.data.id
                                                    ? "bg-purple-100 text-purple-600 shadow-inner"
                                                    : "text-gray-400 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <CiMenuKebab />
                                            </button>

                                            {params.context.activeMenuId === params.data.id && (
                                                <div className={`absolute right-0 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white py-2.5 w-44 z-[999] animate-in fade-in zoom-in duration-200 ${isLastRows
                                                    ? "bottom-[80%] mb-2 slide-in-from-bottom-2"
                                                    : "top-[80%] mt-2 slide-in-from-top-2"
                                                    }`}>
                                                    <div className="px-3 pb-1.5 mb-1.5 border-b border-gray-100/50">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedBus(params.data);
                                                            params.context.setActiveMenuId(null);
                                                        }}
                                                        className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-purple-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                            <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                                                        </div>
                                                        <span className="font-medium">View Details</span>
                                                    </button>

                                                    {params.data.status !== 'Active' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(params.data.id, 'Active');
                                                                params.context.setActiveMenuId(null);
                                                            }}
                                                            className="w-[calc(100%-16px)] mx-2 mt-1 text-left px-3 py-2 text-sm text-green-600 hover:bg-green-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                        >
                                                            <div className="w-6 h-6 rounded-lg bg-green-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                            </div>
                                                            <span className="font-medium">Set Active</span>
                                                        </button>
                                                    )}

                                                    {params.data.status !== 'Maintenance' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(params.data.id, 'Maintenance');
                                                                params.context.setActiveMenuId(null);
                                                            }}
                                                            className="w-[calc(100%-16px)] mx-2 mt-1 text-left px-3 py-2 text-sm text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                        >
                                                            <div className="w-6 h-6 rounded-lg bg-amber-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                                <FontAwesomeIcon icon={faWrench} className="text-[10px]" />
                                                            </div>
                                                            <span className="font-medium">Set Maintenance</span>
                                                        </button>
                                                    )}

                                                    {params.data.status !== 'Inactive' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(params.data.id, 'Inactive');
                                                                params.context.setActiveMenuId(null);
                                                            }}
                                                            className="w-[calc(100%-16px)] mx-2 mt-1 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                        >
                                                            <div className="w-6 h-6 rounded-lg bg-red-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                                <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                                                            </div>
                                                            <span className="font-medium">Set Inactive</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(params.data.id);
                                                            params.context.setActiveMenuId(null);
                                                        }}
                                                        className="w-[calc(100%-16px)] mx-2 mt-1 text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-gray-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                            <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                                        </div>
                                                        <span className="font-medium">Delete Bus</span>
                                                    </button>
                                                </div>
                                            )}
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
                            filter: true,
                            resizable: true,
                            headerClass: "font-bold uppercase text-xs tracking-wide",
                        }}
                        rowHeight={80}
                        headerHeight={50}
                        pagination={true}
                        paginationPageSize={5}
                        paginationPageSizeSelector={[5, 10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4">No buses found</span>'
                    />
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-1 space-y-4 pb-24">
                {filteredBuses.map((bus) => (
                    <div key={bus.id} className="relative bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                        <FontAwesomeIcon icon={faBus} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{bus.busNumber}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mt-1 ${getStatusColor(bus.status)}`}>
                                            {bus.status}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(bus.id)}
                                    className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#40189d' }} />
                                        <p className="text-xs text-gray-500 font-medium">Driver</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate">{bus.driverName}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faUserFriends} className="text-xs" style={{ color: '#40189d' }} />
                                        <p className="text-xs text-gray-500 font-medium">Capacity</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold">{bus.capacity} Seats</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: '#f8f5ff' }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#40189d' }} />
                                    <p className="text-xs text-gray-500 font-medium">Contact</p>
                                </div>
                                <p className="text-sm text-gray-900 font-semibold">{bus.contactNumber}</p>
                            </div>

                            <button
                                onClick={() => setSelectedBus(bus)}
                                className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                style={{ backgroundColor: '#40189d' }}
                            >
                                <FontAwesomeIcon icon={faEye} className="mr-2" /> View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusList;
