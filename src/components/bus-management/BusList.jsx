import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrash, faCheck, faTimes, faEye, faChevronRight, faRoute, faUser, faUserFriends, faPhone, faWrench, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CiMenuKebab } from "react-icons/ci";
import '../../styles/agGridMobileStyles.css';

const BusList = ({
    filteredBuses,
    drivers,
    routes,
    setSelectedBus,
    handleStatusChange,
    handleDriverChange,
    handleRouteChange,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    getStatusColor,
    onSelectionChanged
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Unified Table View */}
            <div className="flex flex-col flex-1 bg-white rounded-none lg:rounded-3xl shadow-none lg:shadow-xl overflow-hidden p-0 lg:p-6 mobile-full-width-table">
                <div className="ag-theme-quartz w-full custom-ag-grid overflow-hidden" style={{
                    height: 'calc(100vh - 165px)',
                    '--ag-header-background-color': '#f8fafc',
                    '--ag-header-foreground-color': '#3b82f6',
                    '--ag-font-family': 'inherit',
                    '--ag-border-radius': '24px',
                    '--ag-row-hover-color': '#f1f5f9',
                }}>
                    <AgGridReact
                        rowData={filteredBuses}
                        columnDefs={[
                            {
                                headerName: "Number",
                                field: "busNumber",
                                flex: 1.2,
                                minWidth: 150,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-3 w-full cursor-pointer group"
                                        onClick={() => setSelectedBus(params.data)}
                                    >
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="font-semibold text-gray-900 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">View Details</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "Bus Name",
                                field: "bus_name",
                                flex: 1.5,
                                minWidth: 160,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="text-gray-900 font-bold text-xs">{params.value || 'N/A'}</span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Driver",
                                field: "driverName",
                                flex: 1.8,
                                minWidth: 180,
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => {
                                    const { activeMenuId, setActiveMenuId, drivers, handleDriverChange } = params.context;
                                    const menuKey = `driver-${params.data.id}`;
                                    const isOpen = activeMenuId === menuKey;
                                    const currentDriverName = params.value || 'Unassigned';

                                    return (
                                        <div className="flex items-center h-full relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(isOpen ? null : menuKey);
                                                }}
                                                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faUser} className="text-blue-600 text-[10px]" />
                                                </div>
                                                <span className="text-gray-900 font-bold text-xs truncate max-w-[100px]">{currentDriverName}</span>
                                                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-[10px] group-hover:text-blue-600 transition-colors" />
                                            </button>

                                            {isOpen && (
                                                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 z-[1000] overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-black/5">
                                                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign Driver</p>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDriverChange(params.data.id, null);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="text-[10px] font-bold text-red-500 hover:text-red-700"
                                                        >
                                                            Unassign
                                                        </button>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                                        {drivers.length === 0 ? (
                                                            <div className="p-3 text-center text-xs text-gray-400 italic">No drivers available</div>
                                                        ) : (
                                                            drivers.map(driver => (
                                                                <button
                                                                    key={driver.driver_id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDriverChange(params.data.id, driver.driver_id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-3 rounded-lg transition-all ${
                                                                        driver.driver_id === params.data.driver_id 
                                                                        ? 'bg-blue-50 text-indigo-700' 
                                                                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                                                    }`}
                                                                >
                                                                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                                        {driver.name ? driver.name.charAt(0) : '?'}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span>{driver.name}</span>
                                                                        <span className="text-[9px] text-gray-400 font-medium">{driver.phone}</span>
                                                                    </div>
                                                                    {driver.driver_id === params.data.driver_id && <FontAwesomeIcon icon={faCheck} className="ml-auto text-blue-600" />}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            },
                            {
                                headerName: "Seats",
                                field: "capacity",
                                flex: 1,
                                minWidth: 140,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUserFriends} className="text-blue-400 text-xs shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">{params.value} Seats</span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Route",
                                field: "route",
                                flex: 2.2,
                                minWidth: 220,
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => {
                                    const { activeMenuId, setActiveMenuId, routes, handleRouteChange } = params.context;
                                    const menuKey = `route-${params.data.id}`;
                                    const isOpen = activeMenuId === menuKey;
                                    const currentRouteName = params.value || 'Unassigned';

                                    return (
                                        <div className="flex items-center h-full relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(isOpen ? null : menuKey);
                                                }}
                                                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer border border-transparent hover:border-emerald-100"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faRoute} className="text-emerald-600 text-[10px]" />
                                                </div>
                                                <span className="text-gray-900 font-bold text-xs truncate max-w-[150px]">{currentRouteName}</span>
                                                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-[10px] group-hover:text-emerald-600 transition-colors" />
                                            </button>

                                            {isOpen && (
                                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 z-[1000] overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-black/5">
                                                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign Route</p>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRouteChange(params.data.id, null);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="text-[10px] font-bold text-red-500 hover:text-red-700"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                                        {routes.length === 0 ? (
                                                            <div className="p-3 text-center text-xs text-gray-400 italic">No routes available</div>
                                                        ) : (
                                                            routes.map(route => (
                                                                <button
                                                                    key={route.route_id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRouteChange(params.data.id, route.route_id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-3 rounded-lg transition-all ${
                                                                        route.route_id === params.data.route_id 
                                                                        ? 'bg-emerald-50 text-emerald-700' 
                                                                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                                                    }`}
                                                                >
                                                                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                                        <FontAwesomeIcon icon={faRoute} />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span>{route.name}</span>
                                                                        <span className="text-[9px] text-gray-400 font-medium">Route ID: {route.route_id.substring(0,8)}...</span>
                                                                    </div>
                                                                    {route.route_id === params.data.route_id && <FontAwesomeIcon icon={faCheck} className="ml-auto text-emerald-600" />}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            },
                            {
                                headerName: "Status",
                                field: "status",
                                flex: 1.5,
                                minWidth: 160,
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => {
                                    const status = params.value;
                                    const { activeMenuId, setActiveMenuId, handleStatusChange } = params.context;
                                    const menuKey = `status-${params.data.id}`;
                                    const isOpen = activeMenuId === menuKey;
                                    
                                    
                                    const statusOptions = ['Active', 'Maintenance', 'Inactive', 'Spare'];

                                    const getStatusGradient = (s) => {
                                        const status = (s || '').toLowerCase();
                                        switch(status) {
                                            case 'active': return 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-200';
                                            case 'maintenance': return 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200';
                                            case 'inactive': return 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-200';
                                            case 'spare': return 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-200';
                                            case 'scrap': return 'bg-gradient-to-r from-gray-500 to-gray-700 shadow-gray-200';
                                            default: return 'bg-gray-500 shadow-gray-200';
                                        }
                                    };

                                    const getStatusIcon = (s) => {
                                        const status = (s || '').toLowerCase();
                                        switch(status) {
                                            case 'active': return faCheck;
                                            case 'maintenance': return faWrench;
                                            case 'inactive': return faTimes;
                                            case 'spare': return faBus;
                                            case 'scrap': return faTrash;
                                            default: return faBus;
                                        }
                                    };

                                    return (
                                        <div className="flex items-center h-full relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(isOpen ? null : menuKey);
                                                }}
                                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer ${getStatusGradient(status)}`}
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                    <FontAwesomeIcon icon={getStatusIcon(status)} className="text-white text-[10px]" />
                                                </div>
                                                
                                                <span className="text-white font-bold text-xs tracking-wide">{status}</span>
                                                
                                                {status === 'Active' && (
                                                    <div className="flex items-center ml-1">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <FontAwesomeIcon icon={faChevronDown} className="text-white/60 text-[10px] ml-1 group-hover:text-white transition-colors" />
                                            </button>

                                            {isOpen && (
                                                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 z-[1000] overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-black/5">
                                                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Change Status</p>
                                                    </div>
                                                    <div className="p-1">
                                                        {statusOptions.map(option => (
                                                            <button
                                                                key={option}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStatusChange(params.data.id, option);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center gap-3 rounded-lg transition-all ${
                                                                    option === status || option.toUpperCase() === (status || '').toUpperCase()
                                                                    ? 'bg-blue-50 text-blue-700' 
                                                                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                                                    option === 'Active' ? 'bg-green-100 text-green-600' : 
                                                                    option === 'Maintenance' ? 'bg-blue-100 text-blue-600' : 
                                                                    option === 'Spare' ? 'bg-orange-100 text-orange-600' : 
                                                                    option === 'Scrap' ? 'bg-gray-100 text-gray-600' :
                                                                    'bg-red-100 text-red-600'
                                                                }`}>
                                                                    <FontAwesomeIcon icon={getStatusIcon(option)} className="text-[10px]" />
                                                                </div>
                                                                {option}
                                                                {(status === option || (status || '').toUpperCase() === option.toUpperCase()) && <FontAwesomeIcon icon={faCheck} className="ml-auto text-blue-600" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            },
                            {
                                headerName: "Actions",
                                field: "id",
                                width: 90,
                                minWidth: 90,
                                pinned: 'right',
                                cellRenderer: (params) => {
                                    const { handleDelete } = params.context;
                                    return (
                                        <div className="flex items-center justify-center h-full">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(params.data.id);
                                                }}
                                                className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
                                                title="Delete Vehicle"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>
                                    );
                                }
                            }
                        ]}
                        context={{ activeMenuId, setActiveMenuId, drivers, routes, handleDriverChange, handleStatusChange, handleRouteChange, handleDelete }}
                        getRowStyle={params => {
                            if (activeMenuId && activeMenuId.includes(params.data.id)) {
                                return { zIndex: 999, overflow: 'visible' };
                            }
                            return { zIndex: 1 };
                        }}
                        rowSelection={{ 
                            mode: 'multiRow', 
                            headerCheckbox: true, 
                            enableClickSelection: false,
                            checkboxes: true
                        }}
                        selectionColumnDef={{ 
                            width: 50, 
                            minWidth: 50, 
                            maxWidth: 50, 
                            pinned: 'left',
                            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
                            headerClass: 'ag-center-header'
                        }}
                        getRowId={params => params.data.id}
                        onSelectionChanged={(params) => {
                            const selectedNodes = params.api.getSelectedNodes();
                            const selectedData = selectedNodes.map(node => node.data);
                            if (setActiveMenuId) setActiveMenuId(null);
                            onSelectionChanged(selectedData);
                        }}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            headerClass: "font-black uppercase text-[12px] tracking-wider ag-center-header",
                        }}
                        rowHeight={isMobile ? 60 : 80}
                        headerHeight={isMobile ? 40 : 50}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4">No buses found</span>'
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
                .ag-checkbox-input-wrapper input {
                    cursor: pointer !important;
                }
            ` }} />

            {/* REMOVED MOBILE CARD VIEW - NOW USING TABLE ON ALL SCREEN SIZES */}
            {/* Mobile/Tablet Card View */}
            {/* <div className="lg:hidden p-4 space-y-6 pb-24">
                {filteredBuses.map((bus) => (
                    <div key={bus.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-50">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#3A7BFF' }}></div>
                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#3A7BFF' }}>
                                        <FontAwesomeIcon icon={faBus} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{bus.busNumber}</h3>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                                            (bus.status || '').toLowerCase() === 'active' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : (bus.status || '').toLowerCase() === 'maintenance'
                                            ? 'text-blue-600 bg-blue-50 border-blue-100'
                                            : 'text-amber-600 bg-amber-50 border-amber-100'
                                        }`}>
                                            {bus.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Driver</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{bus.driverName || 'Unassigned'}</p>
                                </div>
                                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faUserFriends} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Capacity</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{bus.capacity} Seats</p>
                                </div>
                                <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f0f4ff' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FontAwesomeIcon icon={faRoute} className="text-xs" style={{ color: '#3A7BFF' }} />
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Route Assignment</p>
                                    </div>
                                    <p className="text-sm text-gray-900 font-bold truncate tracking-tight">{bus.route || 'TRANSIT (NO ASSIGNMENT)'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedBus(bus)}
                                className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                style={{ backgroundColor: '#3A7BFF' }}
                            >
                                <FontAwesomeIcon icon={faEye} /> View Fleet Asset
                            </button>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default BusList;

/* REMOVED INLINE STYLES - NOW USING SHARED CSS FILE */
