import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ReportCard from './ReportCard';

const ReportsHome = () => {
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
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsHome;
