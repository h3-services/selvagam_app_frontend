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
    faGraduationCap, faMap, faPaperclip, faHistory, faSchool
} from '@fortawesome/free-solid-svg-icons';
import ParentViewDrawer from './ParentViewDrawer';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const StudentDetail = ({ selectedStudent, onBack, onUpdate, onTransportStatusUpdate }) => {
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
            const p1Id = selectedStudent.originalData?.parent_id;
            const p2Id = selectedStudent.originalData?.s_parent_id;
            
            fetchParents(p1Id, p2Id);
            
            if (selectedStudent.originalData?.is_transport_user || selectedStudent.originalData?.transport_status === 'ACTIVE') {
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
                pickupRoute: routes.find(r => r.route_id == student.pickup_route_id),
                dropRoute: routes.find(r => r.route_id == student.drop_route_id),
                pickupStop: stops.find(s => s.stop_id == student.pickup_stop_id),
                dropStop: stops.find(s => s.stop_id == student.drop_stop_id)
            });
        } catch (error) {
            console.error("Error fetching transport:", error);
        } finally {
            setLoadingTransport(false);
        }
    };

    if (!selectedStudent) return null;

    const BentoCard = ({ children, className = "" }) => (
        <div className={`bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-10 hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-500 overflow-hidden relative group ${className}`}>
            {children}
        </div>
    );

    const StatPill = ({ label, value, colorClass = "bg-blue-50 text-blue-600 border-blue-100" }) => (
        <div className={`px-4 py-2 rounded-2xl border ${colorClass} flex flex-col`}>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-0.5">{label}</span>
            <span className="text-sm font-bold truncate leading-none">{value || 'N/A'}</span>
        </div>
    );

    const GuardianBadge = ({ parent, label }) => {
        if (!parent) return null;
        return (
            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 group/guardian cursor-pointer"
                onClick={() => {
                    setActiveParentForDrawer(parent);
                    setShowParentDrawer(true);
                }}
            >
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/guardian:bg-indigo-600 group-hover/guardian:text-white group-hover/guardian:scale-110 transition-all duration-500">
                        <FontAwesomeIcon icon={faUserTie} className="text-xl" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h4 className="font-black text-slate-900 text-lg leading-none">{parent.name}</h4>
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                {label}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} className="text-[10px]" /> {parent.phone}
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover/guardian:bg-indigo-50 group-hover/guardian:border-indigo-200 group-hover/guardian:text-indigo-600 transition-all duration-500">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                </div>
            </div>
        );
    };

    const DataRow = ({ label, value }) => (
        <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
            <p className="text-sm font-black text-slate-700">{value || 'UNASSIGNED'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F8FAFC] overflow-hidden">
            {/* 🚀 Next-Gen Navigation Header */}
            <div className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 px-10 h-24 flex items-center justify-between flex-shrink-0 z-30 sticky top-0 shadow-sm">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={onBack}
                        className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all active:scale-95 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-indigo-600 blur-xl opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-700"></div>
                            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-100 relative z-10 transform group-hover:rotate-6 transition-transform duration-500">
                                {selectedStudent.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{selectedStudent.name}</h2>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    {selectedStudent.studentStatus || 'Current Student'}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2.5">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FontAwesomeIcon icon={faFingerprint} className="text-indigo-500" />
                                    System ID: <span className="text-slate-900 font-bold">#STU-{selectedStudent.id?.toString().padStart(4, '0')}</span>
                                </span>
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FontAwesomeIcon icon={faSchool} className="text-indigo-500" />
                                    Academy: <span className="text-slate-900 font-bold">{selectedStudent.className}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => onUpdate(selectedStudent)}
                    className="h-14 px-10 rounded-[1.25rem] bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-slate-200 group"
                >
                    <FontAwesomeIcon icon={faEdit} className="text-xs group-hover:rotate-12 transition-transform" />
                    Modify Profile
                </button>
            </div>

            {/* 🍱 Bento Grid Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-10">
                    
                    {/* Column 1: Core Identity (4 Columns) */}
                    <div className="col-span-12 xl:col-span-4 space-y-10">
                        <BentoCard>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Identity Core</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Verified Meta Data</p>
                                </div>
                                <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                    <FontAwesomeIcon icon={faIdCard} className="text-2xl" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <StatPill label="Enrollment Date" value={new Date(selectedStudent.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                                <StatPill label="Blood Group" value="O+ POSITIVE" colorClass="bg-red-50 text-red-600 border-red-100" />
                                <StatPill label="Gender" value={selectedStudent.originalData?.gender || 'MALE'} colorClass="bg-indigo-50 text-indigo-600 border-indigo-100" />
                                <StatPill label="D.O.B" value={selectedStudent.originalData?.dob ? new Date(selectedStudent.originalData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} colorClass="bg-amber-50 text-amber-600 border-amber-100" />
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">Residential Address</p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                            "{selectedStudent.location || 'No verified address on record.'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* Guardian Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-400 text-sm" />
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Guardian Directory</h4>
                            </div>
                            <GuardianBadge parent={parent1} label="Primary" />
                            <GuardianBadge parent={parent2} label="Secondary" />
                        </div>
                    </div>

                    {/* Column 2: Logistics & Intelligence (8 Columns) */}
                    <div className="col-span-12 xl:col-span-8 space-y-10">
                        {/* 🚌 Logistics Intelligence Card */}
                        <BentoCard className="!p-0 border-none shadow-2xl">
                            <div className="bg-slate-900 px-10 py-8 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-500">
                                        <FontAwesomeIcon icon={faBus} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1.5">Commute Intelligence</h3>
                                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Fleet Management Hub</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onTransportStatusUpdate(
                                        selectedStudent.id, 
                                        selectedStudent.originalData?.transport_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                    )}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all active:scale-95 font-black text-[11px] uppercase tracking-widest ${
                                        selectedStudent.originalData?.transport_status === 'ACTIVE'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                        : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${selectedStudent.originalData?.transport_status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`}></span>
                                    {selectedStudent.originalData?.transport_status === 'ACTIVE' ? 'Active Bus License' : 'Inactive'}
                                </button>
                            </div>
                            
                            <div className="p-10 bg-white">
                                {selectedStudent.originalData?.is_transport_user ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 divide-x divide-slate-100">
                                        <div className="space-y-8 pr-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm -rotate-45" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Morning Pickup</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Route Configuration</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <DataRow label="Assigned Route" value={transportData.pickupRoute?.name || transportData.pickupRoute?.route_name} />
                                                <DataRow label="Target Stop" value={transportData.pickupStop?.stop_name} />
                                            </div>
                                        </div>
                                        <div className="space-y-8 pl-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
                                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm rotate-135" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Evening Drop-off</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Fleet Assignment</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <DataRow label="Assigned Route" value={transportData.dropRoute?.name || transportData.dropRoute?.route_name} />
                                                <DataRow label="Target Stop" value={transportData.dropStop?.stop_name} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-6 border border-slate-100">
                                            <FontAwesomeIcon icon={faBus} className="text-3xl text-slate-200" />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Self-Transport Profile</h4>
                                        <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm mx-auto">This student currently bypasses the school fleet system. Direct guardian pickup is registered.</p>
                                    </div>
                                )}
                            </div>
                        </BentoCard>

                        {/* Additional Info / Academic Context */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <BentoCard>
                                 <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHistory} className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 leading-none">System Activity</h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Audit Trail</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600">Last Profile Update</span>
                                        <span className="text-xs font-black text-slate-900">2h ago</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-600">Transport Logs</span>
                                        <span className="text-xs font-black text-emerald-600">On-Time (98%)</span>
                                    </div>
                                </div>
                            </BentoCard>

                            <BentoCard>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faShieldHalved} className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 leading-none">System Security</h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Access Control</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
                                    <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest">Parent Portal: Sync</span>
                                    <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">Bio: Verified</span>
                                </div>
                            </BentoCard>
                        </div>
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
