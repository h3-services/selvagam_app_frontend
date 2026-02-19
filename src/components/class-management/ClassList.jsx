import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/agGridMobileStyles.css';
import { 
    faInbox, faUserGraduate, faEllipsisV, 
    faEdit, faCheckCircle, faBan 
} from '@fortawesome/free-solid-svg-icons';
import { useMemo, useState, useEffect } from 'react';

const ClassList = ({ classes, activeMenuId, setActiveMenuId, onUpdateStatus, onEditClass }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const columnDefs = useMemo(() => [
        {
            headerName: "Class Name",
            field: "class_name",
            flex: 1.2,
            minWidth: 200,
            minWidth: 200,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
            cellRenderer: (params) => (
                <div className="flex flex-col items-center overflow-hidden">
                    <p className="font-semibold text-gray-900 leading-none group-hover:text-blue-700 transition-colors truncate text-center">
                        {params.value ? `Class ${params.value.toString().replace(/(grade|class)\s*/i, '').trim()}` : ''}
                    </p>
                </div>
            )
        },
        {
            headerName: "Section",
            field: "section",
            width: 120,
            minWidth: 120,
            minWidth: 120,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
            cellRenderer: (params) => (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs border border-blue-100 shadow-sm uppercase tracking-wide whitespace-nowrap">
                    Section {params.value}
                </span>
            )
        },
        {
            headerName: "Enrollment",
            field: "number_of_students",
            flex: 1,
            minWidth: 150,
            minWidth: 150,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            cellRenderer: (params) => (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-blue-400 text-xs shrink-0" />
                    <span className="text-sm text-gray-600 truncate font-medium">{params.value || 0} Students</span>
                </div>
            )
        },
        {
            headerName: "ACTIONS",
            field: "class_id",
            width: 100,
            pinned: 'right',
            sortable: false,
            filter: false,
            filter: false,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
            cellRenderer: (params) => {
                const { activeMenuId, setActiveMenuId, onEditClass, onUpdateStatus } = params.context;
                const isOpen = activeMenuId === params.data.class_id;
                const isActive = params.data.status === 'ACTIVE';
                
                return (
                    <div className="relative flex items-center justify-center h-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isOpen ? null : params.data.class_id);
                            }}
                            className={`action-menu-trigger w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm ${
                                isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        {isOpen && (
                            <div className="action-menu-container absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="p-1">
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">
                                        Unit Management
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditClass(params.data);
                                            setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="w-4 text-blue-600" />
                                        Modify Settings
                                    </button>

                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg my-1">
                                        Status Control
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateStatus(params.data.class_id, isActive ? 'INACTIVE' : 'ACTIVE');
                                            setActiveMenuId(null);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors ${
                                            isActive ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={isActive ? faBan : faCheckCircle} className="w-4" />
                                        {isActive ? 'Mark as Inactive' : 'Mark as Active'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        }
    ], []);

    if (classes.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-gray-100 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-inner">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl" />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No classes found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 bg-white rounded-none shadow-none overflow-hidden p-0 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 mobile-full-width-table">
            <div className="ag-theme-quartz w-full custom-ag-grid overflow-hidden" style={{
                height: 'calc(100vh - 165px)',
                '--ag-header-background-color': '#f8fafc',
                '--ag-header-foreground-color': '#3b82f6',
                '--ag-font-family': 'inherit',
                '--ag-border-radius': '24px',
                '--ag-row-hover-color': '#f1f5f9',
            }}>
                <AgGridReact
                    rowData={classes}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        sortable: true,
                        filter: false,
                        resizable: true,
                        headerClass: "font-black uppercase text-[12px] tracking-wider ag-center-header",
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                    rowHeight={isMobile ? 60 : 80}
                    headerHeight={isMobile ? 40 : 50}
                    theme="legacy"
                    context={{ activeMenuId, setActiveMenuId, onEditClass, onUpdateStatus }}
                    getRowStyle={params => {
                        if (params.data.class_id === activeMenuId) {
                            return { zIndex: 999, overflow: 'visible' };
                        }
                        return { zIndex: 1 };
                    }}
                    onGridReady={(params) => {
                        if (!isMobile) {
                            params.api.sizeColumnsToFit();
                        }
                    }}
                    onGridSizeChanged={(params) => {
                        if (!isMobile) {
                            params.api.sizeColumnsToFit();
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ClassList;
