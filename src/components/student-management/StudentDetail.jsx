import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faTimes, faCheck, faEdit, faChild, faPhone, 
    faSearch, faArrowLeft, faUserTie, faEnvelope, 
    faMapMarkerAlt, faInfoCircle, faEye, faRoute, 
    faBus, faMapPin, faLocationDot, faClock, 
    faCalendarDay, faIdCard, faVenusMars,
    faChevronLeft, faEllipsisVertical, faBuilding,
    faFingerprint, faCircleCheck, faArrowUpRightFromSquare,
    faGraduationCap, faMap, faPaperclip, faSchool, faWalking, faUserPlus, faRightLeft
} from '@fortawesome/free-solid-svg-icons';
import ParentViewDrawer from './ParentViewDrawer';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';
import { studentService } from '../../services/studentService';

const StudentDetail = ({ selectedStudent, onBack, onUpdate, onEdit, onTransportStatusUpdate }) => {
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
    
    // Parent Selection State
    const [selectingParentRole, setSelectingParentRole] = useState(null); // 'PRIMARY', 'SECONDARY', or null
    const [allParents, setAllParents] = useState([]);
    const [loadingAllParents, setLoadingAllParents] = useState(false);
    const [parentSearchQuery, setParentSearchQuery] = useState("");

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

    const fetchAllParents = async (roleType) => {
        setLoadingAllParents(true);
        try {
            const data = await parentService.getAllParents();
            // Filter logic:
            // 1. If replacing Primary: Filter out current Secondary
            // 2. If replacing Secondary: Filter out current Primary
            // This enforces the "One Role Per Parent" rule
            const otherParentId = roleType === 'PRIMARY' 
                ? selectedStudent.originalData?.s_parent_id 
                : selectedStudent.originalData?.parent_id;
            
            const filtered = data.filter(p => p.parent_id !== otherParentId);
            setAllParents(filtered);
        } catch (error) {
            console.error("Error fetching all parents:", error);
        } finally {
            setLoadingAllParents(false);
        }
    };

    const handleAssignParent = async (parentId) => {
        try {
            if (selectingParentRole === 'PRIMARY') {
                await studentService.updatePrimaryParent(selectedStudent.id, parentId);
            } else {
                await studentService.updateSecondaryParent(selectedStudent.id, parentId);
            }
            
            setSelectingParentRole(null);
            
            // Re-fetch parent data immediately after assignment to ensure sync
            // Both IDs are needed to update parent1 and parent2 state
            const p1Id = selectingParentRole === 'PRIMARY' ? parentId : selectedStudent.originalData?.parent_id;
            const p2Id = selectingParentRole === 'SECONDARY' ? parentId : selectedStudent.originalData?.s_parent_id;
            
            await fetchParents(p1Id, p2Id);

            // Trigger parent update in list view if needed
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(`${selectingParentRole} parent assignment failed:`, error);
        }
    };

    const handleSwitchParents = async () => {
        try {
            await studentService.switchParents(selectedStudent.id);
            // Trigger parent update in list view if needed
            if (onUpdate) await onUpdate();
            
            // Re-fetch parent data immediately after swap
            // Use current IDs but swapped in the fetchParents call
            const p1Id = selectedStudent.originalData?.s_parent_id;
            const p2Id = selectedStudent.originalData?.parent_id;
            await fetchParents(p1Id, p2Id);
        } catch (error) {
            console.error("Parent role swap failed:", error);
        }
    };

    const filteredParentsForSelection = allParents.filter(p => 
        p.name?.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
        p.phone?.toString().includes(parentSearchQuery)
    );

    if (!selectedStudent) return null;

    const SectionHeader = ({ icon, title, subtitle }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div>
                <h3 className="text-base font-black text-slate-900 leading-none tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>
            </div>
        </div>
    );

    const DataRow = ({ label, value, isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''} space-y-1.5`}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || 'Not Provided'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F8FAFC] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Bar */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:h-20 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-xl shadow-slate-200">
                            {selectedStudent.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h2 className="text-base sm:text-xl font-black text-slate-900 leading-none tracking-tight truncate">{selectedStudent.name}</h2>
                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    {selectedStudent.studentStatus || 'Active'}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                                ID: <span className="text-slate-900 font-black">#{selectedStudent.id?.toString().padStart(4, '0')}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onEdit(selectedStudent)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-xs" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-4 sm:gap-8">
                    
                    {/* Left Column - Core Identity */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <SectionHeader icon={faIdCard} title="Student Info" subtitle="Basic Details" />
                            <div className="space-y-6 pt-2">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <DataRow label="Year" value={selectedStudent.studyYear} />
                                    <DataRow label="Class" value={selectedStudent.className} />
                                    <DataRow label="Gender" value={selectedStudent.originalData?.gender || 'NOT PROVIDED'} />
                                    <DataRow label="D.O.B" value={selectedStudent.originalData?.dob ? new Date(selectedStudent.originalData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Provided'} />
                                    <div className="col-span-2 pt-2">
                                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                                            <DataRow label="Contact" value={selectedStudent.emergencyContact} />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-2" />

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Address</p>
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                                                "{selectedStudent.location || 'No address added.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Logistics & Parents */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Bus Details */}
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <SectionHeader icon={faBus} title="Bus Details" subtitle="Pickup & Drop Info" />
                                <button 
                                    onClick={() => onTransportStatusUpdate(selectedStudent.id, selectedStudent.originalData?.transport_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                    className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                                        selectedStudent.originalData?.transport_status === 'ACTIVE' 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                        : 'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}
                                >
                                    {selectedStudent.originalData?.transport_status === 'ACTIVE' ? 'Bus Active' : 'Bus Inactive'}
                                </button>
                            </div>
                            
                            <div className="p-8">
                                {selectedStudent.originalData?.is_transport_user ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                                                </div>
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Pickup</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <DataRow label="Route" value={transportData.pickupRoute?.name || transportData.pickupRoute?.route_name} />
                                                <DataRow label="Stop" value={transportData.pickupStop?.stop_name} />
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6">
                                            <div className="flex items-center gap-3 text-rose-600">
                                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                                                </div>
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Drop</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <DataRow label="Route" value={transportData.dropRoute?.name || transportData.dropRoute?.route_name} />
                                                <DataRow label="Stop" value={transportData.dropStop?.stop_name} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-slate-200 shadow-sm">
                                            <FontAwesomeIcon icon={faWalking} size="xl" />
                                        </div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">No Bus Service</h4>
                                        <p className="text-[11px] font-bold text-slate-400 mt-2 max-w-[280px]">This student does not use the school bus. Parent picks up and drops off directly.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Parents Section */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <SectionHeader icon={faUserTie} title="Parents" subtitle="Family Contacts" />
                                </div>
                                {parent1 && parent2 && (
                                    <button 
                                        onClick={handleSwitchParents}
                                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2.5 active:scale-95 shadow-xl shadow-slate-200"
                                        title="Swap Primary & Secondary Roles"
                                    >
                                        <FontAwesomeIcon icon={faRightLeft} className="text-xs" />
                                        Swap
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { data: parent1, label: "Primary", id: selectedStudent.originalData?.parent_id },
                                    { data: parent2, label: "Secondary", id: selectedStudent.originalData?.s_parent_id }
                                ].map((p, idx) => {
                                    if (loadingParents) {
                                        return (
                                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 animate-pulse space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-200" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                                        <div className="h-2 bg-slate-200 rounded w-1/2" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 pt-4">
                                                    <div className="h-4 bg-slate-200 rounded" />
                                                    <div className="h-4 bg-slate-200 rounded" />
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (p.data) {
                                        return (
                                            <div 
                                                key={idx} 
                                                onClick={() => { setActiveParentForDrawer(p.data); setShowParentDrawer(true); }}
                                                className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                            <FontAwesomeIcon icon={faUserTie} className="text-lg" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors uppercase">{p.data.name}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                                                                    {(() => {
                                                                        const role = p.data.parent_role || p.data.role;
                                                                        if (!role) return 'PARENT';
                                                                        const roleUpper = role.toUpperCase();
                                                                        return roleUpper === 'GUARDIAN' ? 'PARENT' : roleUpper;
                                                                    })()}
                                                                </span>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.label} Parent</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-slate-300 group-hover:text-indigo-600 transition-all" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                                                <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-700">{p.data.phone}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                                                <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-700 truncate">{p.data.email || 'No email provided'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-700 truncate">
                                                                {p.data.city ? `${p.data.city}, ${p.data.district}` : 'No address'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const role = p.label === "Primary" ? 'PRIMARY' : 'SECONDARY';
                                                            setSelectingParentRole(role);
                                                            fetchAllParents(role);
                                                        }}
                                                        className="w-full mt-4 py-3 rounded-xl bg-indigo-50/50 text-indigo-600 border border-dashed border-indigo-200 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white hover:border-solid hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Display for Secondary Parent assignment ONLY if no parent is linked
                                    if (p.label === "Secondary") {
                                        return (
                                            <button 
                                                key={idx}
                                                onClick={() => { setSelectingParentRole('SECONDARY'); fetchAllParents('SECONDARY'); }}
                                                className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-white hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-3 group"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm">
                                                    <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Assign Secondary Parent</p>
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Add Parent</p>
                                                </div>
                                            </button>
                                        );
                                    }

                                    // Primary parent missing case (should be rare)
                                    return (
                                        <div key={idx} className="p-6 rounded-2xl border-2 border-dashed border-red-100 bg-red-50/30 flex flex-col items-center justify-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-200 shadow-sm">
                                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                                            </div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">No Primary Parent</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ParentViewDrawer 
                show={showParentDrawer} 
                onClose={() => { setShowParentDrawer(false); setActiveParentForDrawer(null); }} 
                parentData={activeParentForDrawer} 
            />

            {/* Parent Selection Modal */}
            {selectingParentRole && (
                <div className="fixed inset-0 z-[3100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setSelectingParentRole(null)}
                    />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white w-full max-w-xl animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Assign {selectingParentRole.charAt(0) + selectingParentRole.slice(1).toLowerCase()} Parent</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Select a parent from the list</p>
                            </div>
                            <button 
                                onClick={() => setSelectingParentRole(null)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="p-8 pb-4">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="Search by name or phone..."
                                    value={parentSearchQuery}
                                    onChange={(e) => setParentSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 transition-all outline-none"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8 space-y-3 mt-2">
                            {loadingAllParents ? (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-300">
                                    <FontAwesomeIcon icon={faFingerprint} className="text-4xl mb-4 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Loading parents...</p>
                                </div>
                            ) : filteredParentsForSelection.length > 0 ? (
                                filteredParentsForSelection.map((parent) => (
                                    <div 
                                        key={parent.parent_id}
                                        onClick={() => handleAssignParent(parent.parent_id)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                                                {parent.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-slate-900 uppercase">{parent.name}</p>
                                                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[7px] font-black uppercase tracking-widest border border-indigo-100">
                                                        {(() => {
                                                            const role = parent.parent_role || parent.role;
                                                            if (!role) return 'PARENT';
                                                            const roleUpper = role.toUpperCase();
                                                            return roleUpper === 'GUARDIAN' ? 'PARENT' : roleUpper;
                                                        })()}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{parent.phone}</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            Assign
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-200">
                                    <FontAwesomeIcon icon={faUsers} className="text-4xl mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No matching parents found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default StudentDetail;
