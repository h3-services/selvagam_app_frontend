import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3A7BFF" stroke="white" stroke-width="2"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const MapClickHandler = ({ isEditing, onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            if (isEditing) {
                const { lat, lng } = e.latlng;
                onLocationSelect(lat, lng);
            }
        },
    });
    return null;
};

const LocationMap = ({ center, markerPosition, isEditing, onLocationSelect, mapRef }) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            key={`${center[0]}-${center[1]}`}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
            <MapClickHandler isEditing={isEditing} onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
};

export default LocationMap;
