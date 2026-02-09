import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faUser, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TripStatusBadge from './TripStatusBadge';

const TripList = ({ filteredTrips, handleStatusChange }) => {
    const [activeStatusId, setActiveStatusId] = useState(null);

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
            headerName: "Bus",
            field: "bus",
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: params => (
                <div className="font-medium text-gray-700">{params.value || '-'}</div>
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
            headerName: "Date",
            field: "date",
            flex: 0.8,
            cellStyle: { display: 'flex', alignItems: 'center', color: '#6b7280' },
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
                        <TripStatusBadge status={params.value} />
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
        <div className="flex-1 px-8 pt-2 pb-8 flex flex-col min-h-0 overflow-hidden" onClick={() => setActiveStatusId(null)}>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 flex-1 flex flex-col min-h-0">
                <div className="ag-theme-quartz w-full custom-ag-grid" style={{
                    height: 'calc(100vh - 140px)',
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
                        theme="legacy"
                        getRowStyle={params => {
                            if (params.data.id === activeStatusId) {
                                return { zIndex: 999, overflow: 'visible' };
                            }
                            return { zIndex: 'auto' };
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TripList;
