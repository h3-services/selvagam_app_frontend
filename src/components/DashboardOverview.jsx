import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faChartLine, faBus, faCheckCircle, faTimesCircle, faMapMarkerAlt, faWrench, faArrowRight, faEllipsisH, faRoute } from '@fortawesome/free-solid-svg-icons';
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
            iconBg: 'bg-blue-100 text-blue-600',
            iconColor: 'text-white',
            variant: 'blue'
        },
        {
            title: 'Total Parents',
            value: '156',
            icon: faUserFriends,
            iconBg: 'bg-violet-100 text-violet-600',
            iconColor: 'text-white',
            variant: 'violet'
        },
        {
            title: 'Route Total',
            value: '5',
            icon: faRoute,
            iconBg: 'bg-emerald-100 text-emerald-600',
            iconColor: 'text-white',
            variant: 'emerald'
        }
    ];

    const busStatus = [
        { label: 'Active Buses', value: '24', color: 'emerald', icon: faBus },
        { label: 'Maintenance', value: '2', color: 'amber', icon: faWrench },
        { label: 'Inactive', value: '6', color: 'slate', icon: faTimesCircle }
    ];

    return (
        <div className="h-full p-6 lg:p-10 bg-slate-50 overflow-y-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                </div>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Stats Row - Spans full width on mobile, top 3 blocks */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className={`group rounded-3xl p-6 border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden ${stat.variant === 'dark' ? 'bg-slate-900 border-slate-900 text-white' :
                            stat.variant === 'blue' ? 'bg-white border-blue-100' :
                                stat.variant === 'violet' ? 'bg-white border-violet-100' :
                                    'bg-white border-emerald-100'
                            }`}>
                            {/* Decorative Gradients for Color Variants */}
                            {stat.variant === 'blue' && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}
                            {stat.variant === 'violet' && <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}
                            {stat.variant === 'emerald' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${stat.iconBg}`}>
                                        <FontAwesomeIcon icon={stat.icon} className="text-lg" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`text-4xl font-bold tracking-tight mb-1 ${stat.variant === 'dark' ? 'text-white' : 'text-black'
                                        }`}>{stat.value}</h3>
                                    <p className={`font-medium ${stat.variant === 'dark' ? 'text-slate-400' :
                                        stat.variant === 'blue' ? 'text-blue-600/80' :
                                            stat.variant === 'violet' ? 'text-violet-600/80' :
                                                'text-emerald-600/80'
                                        }`}>{stat.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map Section - Takes up 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[600px]">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Live Fleet Tracking</h3>
                            <p className="text-slate-400 text-sm">Real-time bus locations</p>
                        </div>
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                    </div>
                    <div className="flex-1 relative bg-slate-50">
                        <MapContainer
                            center={[17.4401, 78.3489]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {activeBuses.map(bus => (
                                <Marker key={bus.id} position={bus.location} icon={busIcon}>
                                    <Popup className="custom-popup">
                                        <div className="p-2 min-w-[150px]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-900">{bus.number}</span>
                                                <span className={`w-2 h-2 rounded-full ${bus.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                <FontAwesomeIcon icon={faBus} />
                                                <span>{bus.status}</span>
                                                <span className="text-slate-300">|</span>
                                                <span>{bus.speed}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Fleet Status Panel - 1 Column */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 h-[600px] flex flex-col">
                    <div className="mb-8">
                        <h3 className="font-bold text-lg text-slate-900">Fleet Status</h3>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        {busStatus.map((status, index) => (
                            <div key={index} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                            status.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                                'bg-slate-200 text-slate-600'
                                            }`}>
                                            <FontAwesomeIcon icon={status.icon} className="text-sm" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 block">{status.label}</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900">{status.value}</span>
                                </div>
                                <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${status.color === 'emerald' ? 'bg-emerald-500' :
                                            status.color === 'amber' ? 'bg-amber-500' :
                                                'bg-slate-400'
                                            }`}
                                        style={{ width: `${(parseInt(status.value) / 32) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        {/* Total Summary Card */}
                        <div className="mt-auto bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Fleet Size</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold">32</span>
                                    <span className="text-sm text-slate-400 mb-1.5">Vehicles registered</span>
                                </div>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500 opacity-20 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 rounded-full bg-emerald-500 opacity-20 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
