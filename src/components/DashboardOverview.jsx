import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faRoute, faBus, faCheckCircle, faTimesCircle, faWrench, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Canvas, useFrame } from '@react-three/fiber';

// 3D Bus Model Component (Modern Sleek Design)
function BusModel({ color = "#f59e0b" }) {
    return (
        <group position={[0, -0.2, 0]} scale={[0.55, 0.55, 0.55]}> {/* Reduced scale significantly */}
            {/* Chassis/Bottom */}
            <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[1.9, 0.3, 4.2]} />
                <meshStandardMaterial color="#1f2937" />
            </mesh>

            {/* Lower Body - White */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[1.8, 0.6, 4]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.5} />
            </mesh>

            {/* Upper Body - Blue */}
            <mesh position={[0, 1.2, 0]}>
                <boxGeometry args={[1.8, 0.6, 4]} />
                <meshStandardMaterial color="#3A7BFF" roughness={0.2} metalness={0.5} />
            </mesh>

            {/* Continuous Window Stripe - Sides */}
            <mesh position={[0.91, 1.1, 0]}>
                <boxGeometry args={[0.05, 0.6, 3]} />
                <meshStandardMaterial color="#111827" roughness={0} metalness={0.9} />
            </mesh>
            <mesh position={[-0.91, 1.1, 0]}>
                <boxGeometry args={[0.05, 0.6, 3]} />
                <meshStandardMaterial color="#111827" roughness={0} metalness={0.9} />
            </mesh>

            {/* Front Windshield (Sleek) */}
            <mesh position={[0, 1, 2.01]} rotation={[0.2, 0, 0]}> {/* Slanted slightly */}
                <boxGeometry args={[1.7, 0.8, 0.05]} />
                <meshStandardMaterial color="#111827" roughness={0} metalness={0.9} />
            </mesh>

            {/* Rear Window */}
            <mesh position={[0, 1.1, -2.01]}>
                <boxGeometry args={[1.6, 0.5, 0.05]} />
                <meshStandardMaterial color="#374151" />
            </mesh>

            {/* Roof Air Con Unit (Detail) */}
            <mesh position={[0, 1.55, -1]}>
                <boxGeometry args={[1.2, 0.15, 1.5]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>

            {/* Wheels (Hidden/Flush) */}
            <mesh position={[0.95, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[-0.95, 0.3, 1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[0.95, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[-0.95, 0.3, -1.2]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
                <meshStandardMaterial color="#000" />
            </mesh>

            {/* Headlights (Modern Strip) */}
            <mesh position={[0.6, 0.4, 2.05]}>
                <boxGeometry args={[0.4, 0.1, 0.05]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.6, 0.4, 2.05]}>
                <boxGeometry args={[0.4, 0.1, 0.05]} />
                <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>
            {/* Tail lights */}
            <mesh position={[0.6, 0.5, -2.05]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.6, 0.5, -2.05]}>
                <boxGeometry args={[0.3, 0.1, 0.05]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
        </group>
    );
}

// Component to render 3D marker on the map
const Leaflet3DMarker = ({ position, color, busInfo }) => {
    const map = useMap();
    const [pixelPos, setPixelPos] = useState(null);

    // Update position on map move/zoom
    useMapEvents({
        move: () => {
            const p = map.latLngToContainerPoint(position);
            setPixelPos(p);
        },
        zoom: () => {
            const p = map.latLngToContainerPoint(position);
            setPixelPos(p);
        }
    });

    // Initial position
    useEffect(() => {
        const p = map.latLngToContainerPoint(position);
        setPixelPos(p);
    }, [map, position]);

    if (!pixelPos) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: pixelPos.x,
                top: pixelPos.y,
                width: 80,
                height: 80,
                marginLeft: -40,
                marginTop: -40, // Center it
                zIndex: 1000,
                pointerEvents: 'none' // Let clicks pass through to map if not clicking bus
            }}
            className="group"
        >
            <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                <Canvas camera={{ position: [3, 3, 3], fov: 45 }}>
                    <ambientLight intensity={1.5} /> // High ambient light
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <BusModel color={color} />
                </Canvas>
            </div>
            {/* Hover Tooltip - Simulated Popup */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white p-2 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-[1001]">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{busInfo.number}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${busInfo.status === 'Moving' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    <FontAwesomeIcon icon={faBus} />
                    <span>{busInfo.status}</span>
                    <span className="text-slate-300">|</span>
                    <span>{busInfo.speed}</span>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"></div>
            </div>
        </div>
    );
};

const activeBuses = [
    { id: 101, number: 'AP 29 BD 1234', location: [17.4401, 78.3489], status: 'Moving', speed: '45 km/h', color: '#f59e0b' },
    { id: 102, number: 'AP 29 BD 5678', location: [17.4501, 78.3589], status: 'Stopped', speed: '0 km/h', color: '#ef4444' },
    { id: 103, number: 'AP 29 BD 9012', location: [17.4301, 78.3389], status: 'Moving', speed: '30 km/h', color: '#f59e0b' },
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
                            <p className="text-slate-400 text-sm">Real-time bus locations (3D)</p>
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
                                <Leaflet3DMarker
                                    key={bus.id}
                                    position={bus.location}
                                    color={bus.color}
                                    busInfo={bus}
                                />
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
