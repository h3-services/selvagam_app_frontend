import { useEffect } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const LocationMarker = ({ setPosition, position }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, map]);

    return position ? (
        <Marker position={position}>
            <Popup>Selected Stop Location</Popup>
        </Marker>
    ) : null;
};

// Create custom school/campus icon
export const createSchoolIcon = () => {
    return L.divIcon({
        className: 'custom-school-icon',
        html: `<div style="background: linear-gradient(135deg, #40189d, #6b21a8); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(64,24,157,0.4);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="18" height="18" fill="white">
                <path d="M337.8 5.4C327-1.8 313-1.8 302.2 5.4L166.3 96H48C21.5 96 0 117.5 0 144V464c0 26.5 21.5 48 48 48H256V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32V512H592c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48H473.7L337.8 5.4zM96 192h32c17.7 0 32 14.3 32 32V256c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32zm400 32c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H528c-17.7 0-32-14.3-32-32V224zM96 352h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V384c0-17.7 14.3-32 32-32zm400 32c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H528c-17.7 0-32-14.3-32-32V384z"/>
            </svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });
};

// Create custom numbered stop icon
export const createStopIcon = (number) => {
    return L.divIcon({
        className: 'custom-stop-icon',
        html: `<div style="background: #ef4444; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(239,68,68,0.4); color: white; font-weight: bold; font-size: 12px;">${number}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
};
