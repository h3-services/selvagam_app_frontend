import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faChevronRight, faBuilding, faBus, faCircle, faExchangeAlt, faEye, faTrash, faMapLocationDot, faUserFriends, faUndo } from '@fortawesome/free-solid-svg-icons';
import { CiMenuKebab } from "react-icons/ci";

const RouteList = ({
    filteredRoutes,
    setSelectedRoute,
    handleDelete,
    handleRestore,
    activeMenuId,
    setActiveMenuId,
    openBusReassignModal,
    COLORS,
    activeTab,
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
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#3A7BFF' }}>
                                            <FontAwesomeIcon icon={faRoute} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-gray-900 leading-none group-hover:text-blue-700 transition-colors">{params.value}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">View Details</span>
                                                <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "No. of Students",
                                field: "studentCount",
                                flex: 1,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold text-xs border border-blue-100 uppercase tracking-wide">
                                            <FontAwesomeIcon icon={faUserFriends} className="mr-1.5 opacity-70" />
                                            {params.value} Students
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
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold text-xs border border-blue-100">
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
                                            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
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
                                headerName: activeTab === 'Archived' ? "Restore" : "Delete",
                                field: "id",
                                width: 100,
                                sortable: false,
                                filter: false,
                                cellRenderer: (params) => (
                                    <div className="flex items-center justify-center h-full">
                                        {activeTab === 'Archived' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(params.data.id);
                                                }}
                                                className="w-9 h-9 rounded-xl bg-green-50 text-green-500 hover:bg-green-100 hover:text-green-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
                                                title="Restore Route"
                                            >
                                                <FontAwesomeIcon icon={faUndo} className="text-sm" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(params.data.id);
                                                }}
                                                className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
                                                title="Delete Route"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                )
                            }
                        ]}
                        context={{ activeMenuId, setActiveMenuId }}
                        rowSelection={{ mode: 'multiRow', headerCheckbox: true, enableClickSelection: false }}
                        selectionColumnDef={{ 
                            width: 50, 
                            minWidth: 50, 
                            maxWidth: 50, 
                            pinned: 'left',
                            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                            headerClass: 'ag-center-header'
                        }}
                        onSelectionChanged={(params) => {
                            const selectedNodes = params.api.getSelectedNodes();
                            const selectedData = selectedNodes.map(node => node.data);
                            if (onSelectionChanged) onSelectionChanged(selectedData);
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
                        overlayNoRowsTemplate='<span class="p-4">No routes found</span>'
                        theme="legacy"
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
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#3A7BFF' }}>
                                        <FontAwesomeIcon icon={faRoute} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{route.routeName}</h3>
                                        <p className="text-xs font-bold text-gray-500 mt-1">{route.distance}</p>
                                    </div>
                                </div>
                                {activeTab === 'Archived' ? (
                                    <button
                                        onClick={() => handleRestore(route.id)}
                                        className="w-10 h-10 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-all flex items-center justify-center"
                                        title="Restore Route"
                                    >
                                        <FontAwesomeIcon icon={faUndo} className="text-sm" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleDelete(route.id)}
                                        className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center justify-center"
                                        title="Delete Route"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <p className="text-xs text-gray-500 font-medium">No. of Students</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{route.studentCount} Students</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-2">Assigned Bus</p>
                                    <button
                                        onClick={(e) => openBusReassignModal(route.id, e)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
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
                                <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f0f4ff' }}>
                                    <p className="text-xs text-gray-500 font-medium">Total Stops</p>
                                    <p className="text-sm text-gray-900 font-bold truncate">{route.stops} Stops</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedRoute(route)}
                                className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                style={{ backgroundColor: '#3A7BFF' }}
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
