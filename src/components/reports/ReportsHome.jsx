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
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className='ml-14 lg:ml-0'>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
                        </div>
    
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Content */}
                <div className="flex-1 px-4 lg:px-8 pt-4 pb-8 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col h-full">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                {['daily', 'weekly', 'monthly'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                                            activeTab === tab 
                                            ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                            : 'text-gray-500 hover:text-gray-700'
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
