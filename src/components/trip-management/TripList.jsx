import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faUser, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TripStatusBadge from './TripStatusBadge';
import '../../styles/agGridMobileStyles.css';

const TripList = ({ filteredTrips, handleStatusChange }) => {
    const [activeStatusId, setActiveStatusId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columnDefs = [
        {
            headerName: "Route Name",
            field: "route",
            flex: 1.2,
            minWidth: 180,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: params => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
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
            minWidth: 120,
            cellStyle: { display: 'flex', alignItems: 'center' },
            cellRenderer: params => (
                <div className="font-medium text-gray-700">{params.value || '-'}</div>
            )
        },
        {
            headerName: "Driver",
            field: "driver",
            flex: 1.5,
            minWidth: 200,
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
            minWidth: 110,
            cellStyle: { display: 'flex', alignItems: 'center', color: '#6b7280' },
        },
        {
            headerName: "Status",
            field: "status",
            flex: 1,
            minWidth: 140,
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
        <div className="flex-1 px-0 lg:px-8 pt-2 pb-8 overflow-hidden flex flex-col w-full mobile-full-width-container" onClick={() => setActiveStatusId(null)}>
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
                        rowData={filteredTrips}
                        columnDefs={columnDefs}
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

/* REMOVED INLINE STYLES - NOW USING SHARED CSS FILE */
