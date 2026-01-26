import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faChevronRight, faBuilding, faBus, faCircle, faExchangeAlt, faEye, faTrash, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { CiMenuKebab } from "react-icons/ci";

const RouteList = ({
    filteredRoutes,
    setSelectedRoute,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    openBusReassignModal,
    COLORS
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
                        rowData={filteredRoutes}
                        columnDefs={[
                            {
                                headerName: "Route Name",
                                field: "routeName",
                                flex: 1.5,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-3 w-full cursor-pointer group"
                                        onClick={() => setSelectedRoute(params.data)}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#40189d' }}>
                                            <FontAwesomeIcon icon={faRoute} />
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
                                headerName: "Campus",
                                field: "campusName",
                                flex: 1,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-bold text-xs border border-indigo-100 uppercase tracking-wide">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-1.5 opacity-70" />
                                            {params.value || 'Main Campus'}
                                        </span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Stops",
                                field: "stops",
                                flex: 0.6,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-bold text-xs border border-purple-100">
                                            {params.value} Stops
                                        </span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Bus",
                                field: "assignedBus",
                                flex: 1.2,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <button
                                            onClick={(e) => openBusReassignModal(params.data.id, e)}
                                            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                                            title="Click to reassign bus"
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faBus} className="text-white text-xs" />
                                            </div>
                                            <span className="text-white font-bold text-xs tracking-wide">{params.value}</span>
                                            <div className="flex items-center gap-1 ml-1">
                                                <FontAwesomeIcon icon={faCircle} className="text-green-300 text-[6px] animate-pulse" />
                                                <span className="text-green-200 text-[10px] font-medium">Active</span>
                                            </div>
                                            <FontAwesomeIcon icon={faExchangeAlt} className="text-white/60 text-[10px] ml-1 group-hover:text-white transition-colors" />
                                        </button>
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
                                                            setSelectedRoute(params.data);
                                                            params.context.setActiveMenuId(null);
                                                        }}
                                                        className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-purple-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                                            <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                                                        </div>
                                                        <span className="font-medium">View Details</span>
                                                    </button>

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
                                                        <span className="font-medium">Delete Route</span>
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
                        overlayNoRowsTemplate='<span class="p-4">No routes found</span>'
                    />
                </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-4 space-y-4 pb-24">
                {filteredRoutes.map((route) => (
                    <div key={route.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                        <FontAwesomeIcon icon={faRoute} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{route.routeName}</h3>
                                        <p className="text-xs font-bold text-gray-500 mt-1">{route.distance}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(route.id)}
                                    className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium">Distance</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{route.distance}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-2">Assigned Bus</p>
                                    <button
                                        onClick={(e) => openBusReassignModal(route.id, e)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faBus} className="text-white text-sm" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-white font-bold text-sm">{route.assignedBus}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faExchangeAlt} className="text-white/70 text-xs" />
                                    </button>
                                </div>
                                <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium">Total Stops</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{route.stops} Stops</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRoute(route)}
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

export default RouteList;
