import { useState, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { Canvas } from '@react-three/fiber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus } from '@fortawesome/free-solid-svg-icons';

// 3D Bus Model Component (Modern Sleek Design)
export function BusModel({ color = "#f59e0b" }) {
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

export default Leaflet3DMarker;
