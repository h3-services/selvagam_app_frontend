import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Leaflet3DMarker from './Bus3DMarker';

const MapModule = () => {
    const activeBuses = [
        { id: 101, number: 'AP 29 BD 1234', location: [17.4401, 78.3489], status: 'Moving', speed: '45 km/h', color: '#f59e0b' },
        { id: 102, number: 'AP 29 BD 5678', location: [17.4501, 78.3589], status: 'Stopped', speed: '0 km/h', color: '#ef4444' },
        { id: 103, number: 'AP 29 BD 9012', location: [17.4301, 78.3389], status: 'Moving', speed: '30 km/h', color: '#f59e0b' },
    ];

    return (
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
    );
};

export default MapModule;
