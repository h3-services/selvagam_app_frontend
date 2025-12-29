import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faChartLine, faBell, faBus } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Fix for default marker icon in Leaflet + React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon (using FontAwesome SVG path dynamically)
const busIcon = L.divIcon({
    html: `<div style="background-color: #40189d; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${faBus.icon[0]} ${faBus.icon[1]}" style="width: 16px; height: 16px; fill: white;">
        <path d="${faBus.icon[4]}"></path>
    </svg>
  </div>`,
    className: 'custom-bus-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// Mock Active Buses Data
const activeBuses = [
    { id: 101, number: 'AP 29 BD 1234', location: [17.4401, 78.3489], status: 'Moving', speed: '45 km/h' },
    { id: 102, number: 'AP 29 BD 5678', location: [17.4501, 78.3589], status: 'Stopped', speed: '0 km/h' },
    { id: 103, number: 'AP 29 BD 9012', location: [17.4301, 78.3389], status: 'Moving', speed: '30 km/h' },
];

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
        <div className="h-full p-4 lg:p-8 overflow-y-auto">
            {/* Header - Mobile Safe Layout */}
            <div className="mb-6 mt-16 lg:mt-0 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Welcome back! Here's what's happening in your school today.</p>
                </div>
                {/* Date/Time Badge (Optional Polish) */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">System Online</span>
                </div>
            </div>

            {/* Mobile/Tablet Stats Grid (Vertical) */}
            <div className="lg:hidden grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-lg shadow-purple-900/5 border border-purple-50 flex flex-col justify-between relative overflow-hidden h-32">
                        {/* Decorative Background Blob */}
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: stat.color }}></div>

                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 duration-200" style={{ backgroundColor: stat.bg }}>
                                <FontAwesomeIcon icon={stat.icon} className="text-sm" style={{ color: stat.color }} />
                            </div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                <FontAwesomeIcon icon={faChartLine} className="text-[10px]" />
                                <span className="text-[10px] font-bold">{stat.change}</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">{stat.title}</span>
                            <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Stats Grid */}
            <div className="hidden lg:grid grid-cols-4 gap-6 mb-8">
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

            {/* Content Grid (Map + Recent Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Main Content Area (Active Buses Map) */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-gray-100 p-5 lg:p-6 flex flex-col h-[450px] lg:h-[calc(100vh-380px)] min-h-[450px]">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                <FontAwesomeIcon icon={faBus} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Live Fleet</h3>
                                <p className="text-xs text-gray-500 font-medium">Real-time bus tracking</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-green-700 font-bold uppercase tracking-wide">Live</span>
                        </div>
                    </div>
                    {/* Map Container */}
                    <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
                        <MapContainer
                            center={[17.4401, 78.3489]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            {activeBuses.map(bus => (
                                <Marker key={bus.id} position={bus.location} icon={busIcon}>
                                    <Popup>
                                        <div className="font-bold text-sm">{bus.number}</div>
                                        <div className="text-xs text-gray-600">Status: {bus.status}</div>
                                        <div className="text-xs text-gray-600">Speed: {bus.speed}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 border border-gray-100 p-5 lg:p-6 flex flex-col h-[400px] lg:h-[calc(100vh-380px)] min-h-[400px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBell} className="text-pink-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Activity Feed</h3>
                            <p className="text-xs text-gray-500 font-medium">Latest updates & alerts</p>
                        </div>
                    </div>

                    <div className="space-y-0 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {recentActivity.map((activity, index) => (
                            <div key={activity.id} className="flex gap-4 group relative pb-8 last:pb-0">
                                {/* Connector Line */}
                                {index !== recentActivity.length - 1 && (
                                    <div className="absolute top-10 left-5 w-0.5 h-[calc(100%-10px)] bg-gray-100 group-hover:bg-purple-100 transition-colors"></div>
                                )}

                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white" style={{ backgroundColor: activity.bg }}>
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activity.color }}></div>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-purple-700 transition-colors">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1.5 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
