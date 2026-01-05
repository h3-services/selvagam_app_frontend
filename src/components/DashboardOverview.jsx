import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faChartLine, faBus, faCheckCircle, faTimesCircle, faMapMarkerAlt, faWrench } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon (Modern Pulse Design)
const busIcon = L.divIcon({
    html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <style>
            @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }
        </style>
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: rgba(99, 102, 241, 0.4); animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>
        <div style="position: relative; background-color: #4f46e5; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); z-index: 10;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${faBus.icon[0]} ${faBus.icon[1]}" style="width: 14px; height: 14px; fill: white;">
                <path d="${faBus.icon[4]}"></path>
            </svg>
        </div>
    </div>`,
    className: 'custom-bus-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22] // Center of the 44x44 container
});

const activeBuses = [
    { id: 101, number: 'AP 29 BD 1234', location: [17.4401, 78.3489], status: 'Moving', speed: '45 km/h' },
    { id: 102, number: 'AP 29 BD 5678', location: [17.4501, 78.3589], status: 'Stopped', speed: '0 km/h' },
    { id: 103, number: 'AP 29 BD 9012', location: [17.4301, 78.3389], status: 'Moving', speed: '30 km/h' },
];

const DashboardOverview = () => {
    const stats = [
        {
            title: 'Total Drivers',
            value: '28',
            icon: faCar,
            accent: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Active Parents',
            value: '156',
            icon: faUserFriends,
            accent: 'from-violet-500 to-purple-600',
            iconBg: 'bg-violet-50',
            iconColor: 'text-violet-600',
        },
        {
            title: 'Route Total',
            value: '1,245',
            icon: faChartLine,
            accent: 'from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        }
    ];

    const busStatus = [
        { label: 'Active Buses', value: '24', status: 'In Transit', color: 'emerald', icon: faBus },
        { label: 'Maintenance Bus', value: '2', status: 'In Review', color: 'orange', icon: faWrench },
        { label: 'Inactive Buses', value: '6', status: 'Parked', color: 'slate', icon: faTimesCircle }
    ];

    return (
        <div className="h-full p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
            {/* Header */}
            <div className="mb-8 mt-16 lg:mt-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Real-time overview of your fleet operations.</p>
                    </div>
                </div>
            </div>

            {/* Mobile Stats */}
            <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80">
                        <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center mb-3`}>
                            <FontAwesomeIcon icon={stat.icon} className={`text-sm ${stat.iconColor}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Desktop Stats */}
            <div className="hidden lg:grid grid-cols-3 gap-5 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="relative overflow-hidden bg-white rounded-xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                        {/* Decorative Background Icon (Watermark) */}
                        <div className={`absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 rotate-12`}>
                            <FontAwesomeIcon icon={stat.icon} className={`text-8xl text-slate-900`} />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <FontAwesomeIcon icon={stat.icon} className={`text-lg ${stat.iconColor}`} />
                                </div>
                                {/* Optional: Pill badge could go here */}
                            </div>

                            <div className="mt-3">
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</h3>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                            </div>
                        </div>

                        {/* Bottom Accent Line */}
                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.accent}`}></div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

                {/* Map Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-[480px] lg:h-[560px]">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 text-sm" />
                            </div>
                            <h3 className="font-semibold text-slate-800">Live Fleet Tracking</h3>
                        </div>
                        <span className="text-xs font-medium text-slate-400">3 Active</span>
                    </div>
                    <div className="flex-1 relative">
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
                                        <div className="p-1">
                                            <p className="font-semibold text-sm text-slate-900">{bus.number}</p>
                                            <p className="text-xs text-slate-500 mt-1">{bus.status} · {bus.speed}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Fleet Analytics - Premium Dark Design */}
                <div className="rounded-2xl shadow-xl overflow-hidden flex flex-col h-[480px] lg:h-[560px] bg-gradient-to-br from-slate-800 to-slate-900 text-white relative">

                    {/* Decorative Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                    <div className="relative z-10 px-6 py-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white text-xl tracking-tight">Fleet Status</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Real-time operational metrics</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/5 shadow-inner">
                            <FontAwesomeIcon icon={faChartLine} className="text-white/80 text-sm" />
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 p-6 flex flex-col justify-center gap-8">
                        {busStatus.map((status, index) => (
                            <div key={index} className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${status.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                status.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                    'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                                            }`}>
                                            <FontAwesomeIcon icon={status.icon} className="text-sm" />
                                        </div>
                                        <div>
                                            <span className="text-base font-bold text-white block tracking-wide">{status.label}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${status.color === 'emerald' ? 'text-emerald-400' :
                                                    status.color === 'orange' ? 'text-orange-400' :
                                                        'text-slate-500'
                                                }`}>{status.status}</span>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-white tracking-tight">{status.value}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-2.5 w-full bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 shadow-lg ${status.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                                status.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                                    'bg-slate-600'
                                            }`}
                                        style={{ width: `${(parseInt(status.value) / 32) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Footer */}
                    <div className="relative z-10 px-6 py-5 bg-black/20 backdrop-blur-md border-t border-white/5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-slate-400">Total Vehicles</span>
                            </div>
                            <span className="text-3xl font-black text-white">32</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
