import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faChartLine, faBell } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const DashboardOverview = () => {
    // Mock Statistics Data
    const stats = [
        {
            title: 'Total Drivers',
            value: '28',
            change: '+12%',
            trend: 'up',
            icon: faCar,
            color: '#40189d',
            bg: '#f8f5ff'
        },
        {
            title: 'Active Parents',
            value: '156',
            change: '+5%',
            trend: 'up',
            icon: faUserFriends,
            color: '#db2777',
            bg: '#fdf2f8'
        },
        {
            title: 'Total Trips',
            value: '1,245',
            change: '+18%',
            trend: 'up',
            icon: faChartLine,
            color: '#059669',
            bg: '#ecfdf5'
        },
        {
            title: 'Pending Alerts',
            value: '3',
            change: '-2',
            trend: 'down',
            icon: faBell,
            color: '#d97706',
            bg: '#fffbeb'
        }
    ];

    // Mock Recent Activity Data
    const recentActivity = [
        { id: 1, type: 'driver', message: 'New driver "Michael Chen" registered', time: '2 mins ago', color: '#40189d', bg: '#f8f5ff' },
        { id: 2, type: 'parent', message: 'Parent "Sarah Johnson" added a child', time: '15 mins ago', color: '#db2777', bg: '#fdf2f8' },
        { id: 3, type: 'system', message: 'System maintenance scheduled for tonight', time: '1 hour ago', color: '#6b7280', bg: '#f3f4f6' },
        { id: 4, type: 'driver', message: 'Driver "Alex Smith" completed 50 trips', time: '3 hours ago', color: '#40189d', bg: '#f8f5ff' },
    ];

    return (
        <div className="h-full bg-[#f2f2f2] p-6 lg:p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 duration-300" style={{ backgroundColor: stat.bg }}>
                                <FontAwesomeIcon icon={stat.icon} className="text-xl" style={{ color: stat.color }} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid (Charts placeholder + Recent Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area (e.g., Graphs) - Placeholder Style */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Weekly Activity</h3>
                        <select className="text-xs bg-gray-50 border-none rounded-lg px-3 py-1.5 text-gray-600 font-medium focus:ring-0 cursor-pointer hover:bg-gray-100 transition">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    {/* CSS-only simple bar chart visualization */}
                    <div className="flex-1 flex items-end justify-between px-4 pb-2 gap-4 h-64 border-b border-gray-100 border-dashed">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="w-full bg-gray-50 rounded-t-xl relative group h-full flex items-end">
                                <div
                                    className="w-full rounded-t-xl transition-all duration-500 relative"
                                    style={{
                                        height: `${height}%`,
                                        backgroundColor: i === 5 ? '#40189d' : '#e9d5ff',
                                        opacity: i === 5 ? 1 : 0.7
                                    }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {height * 12} trips
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold uppercase tracking-wide px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4 group cursor-pointer">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 relative" style={{ backgroundColor: activity.bg }}>
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activity.color }}></div>
                                    </div>
                                    {/* Connector Line */}
                                    <div className="absolute top-10 left-1/2 -ml-px w-0.5 h-full bg-gray-100 group-last:hidden"></div>
                                </div>
                                <div className="pb-2">
                                    <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-purple-700 transition-colors">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 text-sm font-bold text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-all">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
