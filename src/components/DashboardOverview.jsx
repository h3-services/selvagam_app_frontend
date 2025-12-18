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
        <div className="h-full p-6 lg:p-8 overflow-y-auto">
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

            {/* Content Grid (Map + Recent Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Content Area (Active Buses Map) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col h-[400px] lg:h-[calc(100vh-380px)] min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Live Active Buses</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Live Updates</span>
                        </div>
                    </div>
                    {/* Map Container */}
                    <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative">
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
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col h-[400px] lg:h-[calc(100vh-380px)] min-h-[300px]">
                    <h3 className="font-bold text-gray-800 text-lg mb-6 shrink-0">Recent Activity</h3>
                    <div className="space-y-6 overflow-y-auto flex-1 pr-2">
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
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
