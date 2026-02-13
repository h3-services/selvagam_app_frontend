import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEllipsisV, faChild, faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useMemo } from 'react';

const ParentList = ({ 
    filteredParents, 
    handleDelete,
    isInactiveView = false
}) => {
    const gridRef = useRef();

    // Column Definitions
    // Column Definitions
    const columnDefs = useMemo(() => [
        {
            headerName: 'Parent Name',
            field: 'name',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex items-center gap-3 w-full cursor-pointer group" onClick={() => {
                   // Handle view details
                }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#40189d' }}>
                        {params.value ? params.value.charAt(0) : '?'}
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value || 'Unknown'}</p>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors mt-0.5">ID: {params.data.parent_id?.substring(0, 6)}</span>
                    </div>
                </div>
            )
        },
        {
            headerName: 'Mobile',
            field: 'phone',
            flex: 1.2,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex flex-col justify-center">
                    <span className="text-gray-900 font-bold text-xs">{params.value}</span>
                </div>
            )
        },
        {
            headerName: 'Student',
            field: 'linkedStudents',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex flex-col justify-center gap-1">
                    {params.value && params.value.map((studentName, idx) => {
                        if (studentName === 'No children linked') return null;
                        return (
                            <span key={idx} className="text-indigo-600 font-bold text-xs truncate flex items-center">
                                <FontAwesomeIcon icon={faChild} className="mr-1.5 opacity-70 w-3" />
                                {studentName}
                            </span>
                        );
                    })}
                    {(!params.value || params.value.length === 0 || params.value[0] === 'No children linked') && 
                        <span className="text-gray-400 text-[10px] italic">No students linked</span>
                    }
                </div>
            )
        },
        {
            headerName: 'Address',
            field: 'street',
            flex: 1.5,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
            cellRenderer: params => (
                <div className="flex flex-col justify-center">
                    <span className="text-gray-700 font-medium text-xs truncate">{params.data.street}</span>
                    <span className="text-gray-400 text-[10px]">{params.data.city}</span>
                </div>
            )
        },
        {
            headerName: 'Status',
            field: 'parents_active_status',
            width: 120,
            filter: false,
            cellDataType: false,
            cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
            cellRenderer: params => (
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    params.value === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                        : 'bg-slate-50 text-slate-500 ring-1 ring-slate-100'
                }`}>
                    {params.value || 'Inactive'}
                </span>
            )
        },
        {
            headerName: 'ACTIONS',
            field: 'parent_id',
            width: 100,
            pinned: 'right',
            sortable: false,
            filter: false,
            cellStyle: { overflow: 'visible' },
            cellRenderer: params => (
                <div className="flex items-center justify-center h-full">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(params.data.parent_id);
                        }}
                        className={`w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm ${
                            isInactiveView 
                            ? 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600' 
                            : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                        }`}
                        title={isInactiveView ? "Activate Parent" : "Deactivate Parent"}
                    >
                        <FontAwesomeIcon icon={isInactiveView ? faCheckCircle : faTrash} />
                    </button>
                </div>
            )
        }
    ], [handleDelete]);

    const defaultColDef = {
        resizable: true,
        headerClass: 'custom-ag-header',
        cellClass: 'custom-ag-cell group',
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Desktop/Tablet Table View */}
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
                            ref={gridRef}
                            rowData={filteredParents}
                            columnDefs={columnDefs}
                            // Removed inline columnDefs

                            defaultColDef={{
                                sortable: true,
                                filter: true,
                                resizable: true,
                                headerClass: "font-bold uppercase text-xs tracking-wide",
                            }}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                            rowHeight={80}
                            headerHeight={50}
                            animateRows={true}
                            suppressCellFocus={true}
                            theme="legacy"
                            overlayNoRowsTemplate='<span class="p-4">No parents found</span>'
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredParents.map((parent) => (
                        <div key={parent.parent_id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#40189d' }}></div>
                            <div className="relative p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                            {parent.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{parent.name}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(parent.parent_id)}
                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f8f5ff' }}>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Student</p>
                                        <div className="flex flex-wrap gap-2">
                                            {parent.linkedStudents && parent.linkedStudents.map((studentName, idx) => {
                                                if (studentName === 'No children linked') return <span key={idx} className="text-gray-400 text-[10px] italic">No students linked</span>;
                                                return (
                                                    <span key={idx} className="text-indigo-600 font-bold text-xs truncate flex items-center bg-white px-2 py-1 rounded-lg border border-indigo-100 shadow-sm">
                                                        <FontAwesomeIcon icon={faChild} className="mr-1.5 opacity-70 w-3" />
                                                        {studentName}
                                                    </span>
                                                );
                                            })}
                                            {(!parent.linkedStudents || parent.linkedStudents.length === 0) && 
                                                <span className="text-gray-400 text-[10px] italic">No students linked</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                                        <p className="text-sm text-gray-900 font-bold truncate">{parent.phone}</p>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            parent.parents_active_status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'
                                        }`}>
                                            {parent.parents_active_status || 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl mt-2" style={{ backgroundColor: '#f8f5ff' }}>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                                    <p className="text-xs text-gray-900 font-medium truncate">{parent.street}, {parent.city}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParentList;
