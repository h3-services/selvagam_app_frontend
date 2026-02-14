import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faTimes, faCheck, faEdit, faChild, faPhone, 
    faSearch, faArrowLeft, faUserTie, faEnvelope, 
    faMapMarkerAlt, faInfoCircle, faEye, faRoute, 
    faBus, faMapPin, faLocationDot, faClock, 
    faShieldHalved, faCalendarDay, faIdCard, faVenusMars,
    faChevronLeft, faEllipsisVertical, faBuilding,
    faFingerprint, faCircleCheck, faArrowUpRightFromSquare,
    faGraduationCap, faMap, faPaperclip, faHistory
} from '@fortawesome/free-solid-svg-icons';
import ParentViewDrawer from './ParentViewDrawer';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const StudentDetail = ({ selectedStudent, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [parent1, setParent1] = useState(null);
    const [parent2, setParent2] = useState(null);
    const [loadingParents, setLoadingParents] = useState(false);
    const [activeParentForDrawer, setActiveParentForDrawer] = useState(null);
    const [showParentDrawer, setShowParentDrawer] = useState(false);
    
    const [transportData, setTransportData] = useState({
        pickupRoute: null,
        dropRoute: null,
        pickupStop: null,
        dropStop: null
    });
    const [loadingTransport, setLoadingTransport] = useState(false);

    useEffect(() => {
        if (selectedStudent) {
            setEditData({ ...selectedStudent });
            const p1Id = selectedStudent.originalData?.parent_id;
            const p2Id = selectedStudent.originalData?.s_parent_id;
            
            fetchParents(p1Id, p2Id);
            
            if (selectedStudent.originalData?.is_transport_user) {
                fetchTransportInfo(selectedStudent.originalData);
            }
        }
    }, [selectedStudent]);

    const fetchParents = async (p1Id, p2Id) => {
        setLoadingParents(true);
        try {
            const [data1, data2] = await Promise.all([
                p1Id ? parentService.getParentById(p1Id) : Promise.resolve(null),
                p2Id ? parentService.getParentById(p2Id) : Promise.resolve(null)
            ]);
            setParent1(data1);
            setParent2(data2);
        } catch (error) {
            console.error("Error fetching parents:", error);
        } finally {
            setLoadingParents(false);
        }
    };

    const fetchTransportInfo = async (student) => {
        setLoadingTransport(true);
        try {
            const [routes, stops] = await Promise.all([
                routeService.getAllRoutes(),
                routeService.getAllRouteStops()
            ]);
            setTransportData({
                pickupRoute: routes.find(r => r.route_id === student.pickup_route_id),
                dropRoute: routes.find(r => r.route_id === student.drop_route_id),
                pickupStop: stops.find(s => s.stop_id === student.pickup_stop_id),
                dropStop: stops.find(s => s.stop_id === student.drop_stop_id)
            });
        } catch (error) {
            console.error("Error fetching transport:", error);
        } finally {
            setLoadingTransport(false);
        }
    };

    if (!selectedStudent) return null;

    const CompactSectionHeader = ({ icon, title, color = "indigo" }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                <FontAwesomeIcon icon={icon} className="text-xs" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
        </div>
    );

    const CompactDataRow = ({ label, value, isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''}`}>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xs font-bold text-slate-700 truncate">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-white overflow-hidden font-outfit">
            {/* Ultra-Compact Sticky Header */}
            <div className="bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between flex-shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 hover:bg-slate-50 rounded-xl text-slate-400 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-lg font-bold">
                            {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-none">{selectedStudent.name}</h1>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                                {selectedStudent.className} • ID: #STU-{selectedStudent.id?.toString().slice(-4)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider border border-emerald-100">
                        {selectedStudent.studentStatus || 'Active'}
                    </span>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="h-10 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={isEditing ? faCheck : faEdit} className="text-[10px]" />
                        {isEditing ? 'SYNC' : 'MANAGE'}
                    </button>
                </div>
            </div>

            {/* High-Density Grid Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 h-full divide-x divide-slate-100">
                    
                    {/* Panel 1: Core Record (Left) */}
                    <div className="col-span-1 p-6 space-y-8 bg-slate-50/30">
                        <div>
                            <CompactSectionHeader icon={faIdCard} title="Identity" />
                            <div className="grid grid-cols-1 gap-5">
                                <CompactDataRow label="Admission Date" value={new Date(selectedStudent.date).toLocaleDateString()} />
                                <CompactDataRow label="D.O.B" value={selectedStudent.originalData?.dob ? new Date(selectedStudent.originalData.dob).toLocaleDateString() : 'N/A'} />
                                <CompactDataRow label="Gender" value={selectedStudent.originalData?.gender || 'Male'} />
                                <CompactDataRow label="Blood Group" value="O+ Positive" />
                            </div>
                        </div>

                        <div>
                            <CompactSectionHeader icon={faMapMarkerAlt} title="Residence" />
                            <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                                <p className="text-[11px] font-bold text-slate-800 leading-relaxed italic">
                                    "{selectedStudent.location || 'Address not synced'}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel 2: Guardian Network (Middle) */}
                    <div className="col-span-1 lg:col-span-2 p-6 space-y-6">
                        <CompactSectionHeader icon={faUserTie} title="Guardian Network" color="blue" />
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { data: parent1, label: "Primary", id: "p1" },
                                { data: parent2, label: "Secondary", id: "p2" }
                            ].filter(p => p.data).map((parent) => (
                                <div key={parent.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-[8px] font-bold text-blue-500 uppercase tracking-[2px] mb-1">{parent.label}</p>
                                            <h4 className="text-sm font-bold text-slate-900">{parent.data.name}</h4>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setActiveParentForDrawer(parent.data);
                                                setShowParentDrawer(true);
                                            }} 
                                            className="w-8 h-8 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faPhone} className="text-[9px] text-slate-300" />
                                            <CompactDataRow label="Phone" value={parent.data.phone} />
                                        </div>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-[9px] text-slate-300" />
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                                                <p className="text-[11px] font-bold text-slate-700 truncate">{parent.data.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel 3: Fleet Logistics (Right) */}
                    <div className="col-span-1 lg:col-span-2 p-6 bg-slate-50/10">
                        <div className="flex items-center justify-between mb-6">
                            <CompactSectionHeader icon={faBus} title="Logistics Hub" color="rose" />
                            <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${selectedStudent.originalData?.is_transport_user ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                {selectedStudent.originalData?.is_transport_user ? 'Fleet Active' : 'Self Transport'}
                            </div>
                        </div>

                        {selectedStudent.originalData?.is_transport_user ? (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Morning Protocol */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FontAwesomeIcon icon={faClock} size="3xl" className="text-blue-900" />
                                    </div>
                                    <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-[3px] mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Morning Pickup
                                    </h5>
                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <CompactDataRow label="Fleet Route" value={transportData.pickupRoute?.route_name} />
                                        <CompactDataRow label="Stop Node" value={transportData.pickupStop?.stop_name} />
                                    </div>
                                </div>

                                {/* Evening Protocol */}
                                <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-rose-500 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FontAwesomeIcon icon={faRoute} size="3xl" className="text-rose-900" />
                                    </div>
                                    <h5 className="text-[10px] font-bold text-rose-600 uppercase tracking-[3px] mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                        Evening Drop
                                    </h5>
                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <CompactDataRow label="Fleet Route" value={transportData.dropRoute?.route_name} />
                                        <CompactDataRow label="Stop Node" value={transportData.dropStop?.stop_name} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[300px] rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 bg-slate-50/50">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                                    <FontAwesomeIcon icon={faBus} size="xl" />
                                </div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[4px]">Private Logistics</h4>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <ParentViewDrawer 
                show={showParentDrawer}
                onClose={() => {
                    setShowParentDrawer(false);
                    setActiveParentForDrawer(null);
                }}
                parentData={activeParentForDrawer}
            />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            `}</style>
        </div>
    );
};

export default StudentDetail;
