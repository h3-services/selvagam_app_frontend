import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { driverService } from '../../services/driverService';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = L.divIcon({
    className: 'custom-bus-icon',
    html: `
        <div class="relative w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white ring-4 ring-indigo-500/20 transform hover:scale-110 transition-transform">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bus" class="svg-inline--fa fa-bus w-5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M480 32c0-17.7-14.3-32-32-32H64C46.3 0 32 14.3 32 32V64v64 16 112c0 24.5 13.9 45.8 34.1 56.2L32 419.6c-4.4 17.1 5.9 34.6 23 39s34.6-5.9 39-23l25.1-97.6H392.9l25.1 97.6c4.4 17.1 21.9 27.3 39 23s27.3-21.9 23-39L445.9 312.2C466.1 301.8 480 280.5 480 256V144 128 64 32zm-64 64V224H96V96H416zM160 304a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm192 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></svg>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

const LiveFleetMap = ({ onSelectBus, height = "100%", zoom = 14 }) => {
    const [locations, setLocations] = useState([]);
    const [mapCenter, setMapCenter] = useState([12.7050, 80.0150]);
    const [loading, setLoading] = useState(true);

    const fetchLocations = useCallback(async () => {
        try {
            const data = await driverService.getAllDriverLocations();
            setLocations(data || []);
            if (loading && data?.length > 0) {
                setMapCenter([data[0].latitude, data[0].longitude]);
            }
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchLocations();
        const timer = setInterval(() => fetchLocations(), 10000);
        return () => clearInterval(timer);
    }, [fetchLocations]);

    return (
        <div className="relative w-full h-full overflow-hidden" style={{ height }}>
            <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={mapCenter} zoom={zoom + 1} />
                
                {locations.map((loc) => (
                    <Marker 
                        key={loc.driver_id} 
                        position={[loc.latitude, loc.longitude]} 
                        icon={busIcon}
                        eventHandlers={{
                            click: () => onSelectBus?.(loc),
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h5 className="font-black text-slate-900 border-b pb-1 mb-2 tracking-tight uppercase text-xs">{loc.driver_name}</h5>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Live Status</p>
                                    <p className="text-[9px] font-bold text-indigo-600 uppercase">Updating via Satellite</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* In-Map Legend (Minimal) */}
            <div className="absolute bottom-6 right-6 z-[1000] p-4 bg-white/90 backdrop-blur-md border border-white shadow-xl rounded-2xl text-slate-900">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">Live Fleet Map</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[8px] font-bold uppercase text-slate-500">Online</span>
                    </div>
                </div>
            </div>

            <style>{`
                .leaflet-container { font-family: 'Outfit', sans-serif; border-radius: inherit; }
                .leaflet-popup-content-wrapper { 
                    border-radius: 12px; 
                    padding: 0;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                }
                .leaflet-popup-tip { display: none; }
                .custom-bus-icon { box-shadow: none !important; }
            `}</style>
        </div>
    );
};

export default LiveFleetMap;
