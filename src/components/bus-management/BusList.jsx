import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrash, faCheck, faTimes, faEye, faChevronRight, faRoute, faUser, faUserFriends, faPhone, faWrench, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
                                headerName: "Seating Capacity",
                                field: "capacity",
                                flex: 1,
                                cellStyle: { display: 'flex', alignItems: 'center' },
                                cellRenderer: (params) => (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUserFriends} className="text-purple-400 text-xs shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">{params.value} Seats</span>
                                    </div>
                                )
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
                                cellStyle: { overflow: 'visible' },
                                cellRenderer: (params) => {
                                    const status = params.value;
                                    const { activeMenuId, setActiveMenuId } = params.context;
                                    const isOpen = activeMenuId === params.data.id;
                                    
                                    
                                    const statusOptions = ['Active', 'Maintenance', 'Inactive', 'Spare', 'Scrap'];

                                    const getStatusGradient = (s) => {
                                        switch(s) {
                                            case 'Active': return 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-200';
                                            case 'Maintenance': return 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-200';
                                            case 'Inactive': return 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-200';
                                            case 'Spare': return 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-orange-200';
                                            case 'Scrap': return 'bg-gradient-to-r from-gray-500 to-gray-700 shadow-gray-200';
                                            default: return 'bg-gray-500';
                                        }
                                    };

                                    const getStatusIcon = (s) => {
                                        switch(s) {
                                            case 'Active': return faCheck;
                                            case 'Maintenance': return faWrench;
                                            case 'Inactive': return faTimes;
                                            case 'Spare': return faBus;
                                            case 'Scrap': return faTrash;
                                            default: return faBus;
                                        }
                                    };

                                    return (
                                        <div className="flex items-center h-full relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(isOpen ? null : params.data.id);
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
                                                                    option === status 
                                                                    ? 'bg-purple-50 text-purple-700' 
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
                                                                {status === option && <FontAwesomeIcon icon={faCheck} className="ml-auto text-purple-600" />}
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
                                            title="Delete Bus"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                        </button>
                                    </div>
                                )
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
                            resizable: true,
                            headerClass: "font-bold uppercase text-xs tracking-wide",
                        }}
                        rowHeight={80}
                        headerHeight={50}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4">No buses found</span>'
                        theme="legacy"
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
