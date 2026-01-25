import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRoute, faBus, faUser, faClock, faCheckCircle, faTimesCircle, faSpinner,
    faSearch, faPlus, faEllipsisV, faTrash, faEdit, faEye
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const TripManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [trips, setTrips] = useState([
        {
            id: 'TRIP-001',
            route: 'Route A - Downtown',
            bus: 'AP 29 BD 1234',
            driver: 'John Doe',
            startTime: '08:00 AM',
            endTime: '09:30 AM',
            status: 'Completed',

            date: '2024-01-20',
            date: '2024-01-20',
            driverMobile: '+91 98765 43210',
            description: 'Regular morning route for downtown office areas'
        },
        {
            id: 'TRIP-002',
            route: 'Route B - Westside',
            bus: 'AP 29 BD 5678',
            driver: 'Jane Smith',
            startTime: '08:15 AM',
            endTime: '09:45 AM',
            status: 'In Progress',

            date: '2024-01-20',
            date: '2024-01-20',
            driverMobile: '+91 98765 43211',
            description: 'Serves Westside residential complex'
        },
        {
            id: 'TRIP-003',
            route: 'Route C - North Hills',
            bus: 'AP 29 BD 9012',
            driver: 'Mike Johnson',
            startTime: '07:45 AM',
            endTime: '09:15 AM',
            status: 'In Progress',

            date: '2024-01-21',
            date: '2024-01-21',
            driverMobile: '+91 98765 43212',
            description: 'North Hills school district loop'
        },
    ]);

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [activeStatusId, setActiveStatusId] = useState(null);

    const filteredTrips = trips.filter(trip =>
        trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            setTrips(trips.filter(t => t.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setTrips(trips.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const StatusBadge = ({ status }) => {
        let colorClass = 'bg-gray-100 text-gray-600';
        let icon = faSpinner;

        if (status === 'Completed') {
            colorClass = 'bg-green-100 text-green-700 border-green-200';
            icon = faCheckCircle;
        } else if (status === 'In Progress') {
            colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
            icon = faSpinner; // Or a moving icon
        } else if (status === 'Scheduled') {
            colorClass = 'bg-purple-100 text-purple-700 border-purple-200';
            icon = faClock;
        } else if (status === 'Cancelled') {
            colorClass = 'bg-red-100 text-red-700 border-red-200';
            icon = faTimesCircle;
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit ${colorClass}`}>
                <FontAwesomeIcon icon={icon} className={status === 'In Progress' ? 'animate-spin' : ''} />
                {status}
            </span>
        );
    };

    const columnDefs = [

        {
            headerName: "Route Name",
            field: "route",
            flex: 1.2,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: params => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FontAwesomeIcon icon={faRoute} />
                    </div>
                    <span>{params.value}</span>
                </div>
            )
        },

        {
            headerName: "Driver",
            field: "driver",
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: params => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <FontAwesomeIcon icon={faUser} size="sm" />
                    </div>
                    <div className="flex flex-col justify-center -space-y-0.5">
                        <span className="font-semibold text-gray-900 text-sm leading-none">{params.data.driver}</span>
                        <span className="text-[11px] text-gray-500 font-medium leading-none mt-1">{params.data.driverMobile}</span>
                    </div>
                </div>
            )
        },
        {
            headerName: "Description",
            field: "description",
            flex: 1.5,
            wrapText: true,
            autoHeight: true,
            cellStyle: { display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem', whiteSpace: 'normal', lineHeight: '1.4', paddingTop: '12px', paddingBottom: '12px' }
        },
        {
            headerName: "Status",
            field: "status",
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center', overflow: 'visible' },
            cellRenderer: params => (
                <div className="relative">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveStatusId(activeStatusId === params.data.id ? null : params.data.id);
                        }}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <StatusBadge status={params.value} />
                    </div>
                    {activeStatusId === params.data.id && (
                        <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(params.data.id, 'In Progress'); setActiveStatusId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors"
                            >
                                <FontAwesomeIcon icon={faSpinner} className="text-blue-400" /> In Progress
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(params.data.id, 'Completed'); setActiveStatusId(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-3 transition-colors"
                            >
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" /> Completed
                            </button>
                        </div>
                    )}
                </div>
            )
        },


    ];

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in" onClick={() => { setActiveMenuId(null); setActiveStatusId(null); }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trip Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage daily trips, schedules, and assignments</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search trips..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>


                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 p-8 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 h-full flex flex-col">
                    <div className="ag-theme-quartz w-full h-full custom-ag-grid" style={{
                        '--ag-header-background-color': '#f8f5ff',
                        '--ag-header-foreground-color': '#40189d',
                        '--ag-font-family': 'inherit',
                        '--ag-border-radius': '16px',
                        '--ag-row-hover-color': '#faf5ff',
                    }}>
                        <AgGridReact
                            rowData={filteredTrips}
                            columnDefs={columnDefs}
                            defaultColDef={{
                                sortable: true,
                                filter: false,
                                resizable: true,
                                headerClass: "font-bold uppercase text-xs tracking-wide",
                            }}
                            rowHeight={80}
                            headerHeight={50}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[5, 10, 20, 50]}
                            overlayNoRowsTemplate='<span class="p-4">No trips found</span>'
                            animateRows={true}
                            getRowStyle={params => {
                                if (params.data.id === activeMenuId || params.data.id === activeStatusId) {
                                    return { zIndex: 999, overflow: 'visible' };
                                }
                                return { zIndex: 'auto' };
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripManagement;
