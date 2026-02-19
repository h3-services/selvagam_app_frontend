import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faChevronRight, faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/agGridMobileStyles.css';

const RouteList = ({
    filteredRoutes,
    setSelectedRoute,
    handleDelete,
    handleRestore,
    activeMenuId,
    setActiveMenuId,
    openBusReassignModal,
    activeTab,
    onSelectionChanged
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full lg:bg-transparent">
            {/* Unified Table View for All Screen Sizes */}
            <div className="flex flex-col flex-1 overflow-hidden p-0 w-full">
                <div className="ag-theme-quartz w-full custom-ag-grid flex-1 overflow-hidden" style={{
                    height: 'calc(100vh - 165px)',
                    '--ag-header-background-color': '#f0f4ff',
                    '--ag-header-foreground-color': '#3b82f6',
                    '--ag-font-family': 'inherit',
                    '--ag-border-radius': '24px',
                    '--ag-row-hover-color': '#f1f5f9',
                }}>
                    <AgGridReact
                        rowData={filteredRoutes}
                        columnDefs={[
                            {
                                headerName: "Route Name",
                                field: "routeName",
                                flex: 1.5,
                                minWidth: 200,
                                cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                                cellRenderer: (params) => (
                                    <div
                                        className="flex items-center gap-3 w-full cursor-pointer group"
                                        onClick={() => setSelectedRoute(params.data)}
                                    >
                                        <div className="flex flex-col ml-1">
                                            <p className="font-light text-gray-950 leading-none group-hover:text-blue-700 transition-colors truncate">{params.value}</p>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                headerName: "No. of Students",
                                field: "studentCount",
                                flex: 1,
                                minWidth: 150,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-light text-xs border border-blue-100 uppercase tracking-wide">
                                            {params.value} Students
                                        </span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Stops",
                                field: "stops",
                                flex: 0.8,
                                minWidth: 120,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-light text-xs border border-blue-100">
                                            {params.value} Stops
                                        </span>
                                    </div>
                                )
                            },
                            {
                                headerName: "Bus",
                                field: "assignedBus",
                                flex: 1.2,
                                minWidth: 160,
                                cellRenderer: (params) => (
                                    <div className="flex items-center h-full">
                                        <button
                                            onClick={(e) => openBusReassignModal(params.data.id, e)}
                                            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                                            title="Click to reassign bus"
                                        >
                                            <span className="text-white font-light text-xs tracking-wide">{params.value}</span>
                                            <div className="flex items-center gap-1 ml-1">
                                                <span className="text-green-300 text-[10px] font-medium uppercase tracking-widest">Active</span>
                                            </div>
                                        </button>
                                    </div>
                                )
                            },
                            {
                                headerName: activeTab === 'Archived' ? "Restore" : "Delete",
                                field: "id",
                                width: 90,
                                minWidth: 90,
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
                            headerClass: 'ag-center-header',
                            headerComponentParams: {
                                template: '<div class="ag-cell-label-container" role="presentation" style="display: flex; justify-content: center; align-items: center; width: 100%;"><span ref="eCheckbox" class="ag-header-select-all"></span></div>'
                            }
                        }}
                        onSelectionChanged={(params) => {
                            const selectedNodes = params.api.getSelectedNodes();
                            const selectedData = selectedNodes.map(node => node.data);
                            if (onSelectionChanged) onSelectionChanged(selectedData);
                        }}
                        defaultColDef={{
                            sortable: true,
                            resizable: true,
                            headerClass: "font-black uppercase text-[12px] tracking-wider",
                        }}
                        rowHeight={isMobile ? 60 : 80}
                        headerHeight={isMobile ? 40 : 50}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 20, 50]}
                        overlayNoRowsTemplate='<span class="p-4 font-light uppercase text-xs tracking-widest text-gray-300">No routes found</span>'
                        theme="legacy"
                        suppressRowTransform={true}
                        getRowStyle={params => {
                            if (params.data.id === activeMenuId) {
                                return { zIndex: 999, overflow: 'visible' };
                            }
                            return { zIndex: 'auto' };
                        }}
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
        </div>
    );
};

export default RouteList;
