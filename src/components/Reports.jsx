import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileDownload, faFilter, faChartPie, faCalendarAlt,
    faFileExcel, faFilePdf, faSearch
} from '@fortawesome/free-solid-svg-icons';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [searchQuery, setSearchQuery] = useState('');

    const [reportData] = useState([
        { id: 'RPT-2024-001', name: 'Daily Trip Summary', type: 'Trip', date: '2024-01-24', status: 'Generated', size: '1.2 MB' },
        { id: 'RPT-2024-002', name: 'Driver Attendance Log', type: 'Driver', date: '2024-01-24', status: 'Generated', size: '0.8 MB' },
        { id: 'RPT-2024-003', name: 'Fuel Consumption Analysis', type: 'Maintenance', date: '2024-01-23', status: 'Pending', size: '-' },
        { id: 'RPT-2024-004', name: 'Student Usage Report', type: 'Student', date: '2024-01-23', status: 'Generated', size: '2.4 MB' },
        { id: 'RPT-2024-005', name: 'Weekly Route Performance', type: 'Route', date: '2024-01-22', status: 'Generated', size: '1.5 MB' },
    ]);

    const filteredReports = reportData.filter(report =>
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
                        <p className="text-sm text-gray-500 mt-1">Access detailed insights and export data</p>
                    </div>

                    <div className="relative group w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-slate-100 transition-all outline-none"
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
                            {['daily', 'weekly', 'monthly'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <FontAwesomeIcon icon={faChartPie} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.status === 'Generated' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                        {report.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-4">{report.type} Report</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Date</span>
                                        <span className="font-semibold text-gray-700">{report.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Size</span>
                                        <span className="font-semibold text-gray-700">{report.size}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-50">
                                    <button className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faFileExcel} /> Excel
                                    </button>
                                    <button className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faFilePdf} /> PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
