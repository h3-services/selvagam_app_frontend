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

const StudentDetail = ({ selectedStudent, onBack, onUpdate, onTransportStatusUpdate }) => {
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

    const SectionHeader = ({ icon, title, subtitle }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>
            </div>
        </div>
    );

    const DataRow = ({ label, value, isFullWidth = false }) => (
        <div className={`${isFullWidth ? 'col-span-2' : ''} space-y-1.5`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="flex-1 h-full flex flex-col bg-[#F1F5F9] overflow-hidden">
            {/* Enterprise Header Bar */}
            <div className="bg-white border-b border-slate-200 px-8 h-20 flex items-center justify-between flex-shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">
                            {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 leading-none">{selectedStudent.name}</h2>
                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                    {selectedStudent.studentStatus || 'Active'}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1.5">
                                Student ID: <span className="text-slate-900 font-bold">#STU-{selectedStudent.id?.toString().padStart(4, '0')}</span> • Class: <span className="text-slate-900 font-bold">{selectedStudent.className}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={isEditing ? faCheck : faEdit} className="text-xs" />
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Content Area: Professional Multi-Card Layout */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
                    
                    {/* Main Sidebar (Left - 4 Columns) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Quick Action Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <SectionHeader icon={faIdCard} title="Identity Overview" subtitle="System Records" />
                            <div className="space-y-6 pt-2">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600">
                                        <FontAwesomeIcon icon={faGraduationCap} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Class</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedStudent.className}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <DataRow label="Admission Date" value={new Date(selectedStudent.date).toLocaleDateString()} />
                                    <DataRow label="Blood Group" value="O+ Positive" />
                                    <DataRow label="Gender" value={selectedStudent.originalData?.gender || 'Male'} />
                                    <DataRow label="D.O.B" value={selectedStudent.originalData?.dob ? new Date(selectedStudent.originalData.dob).toLocaleDateString() : 'N/A'} />
                                    <div className="col-span-2 space-y-1.5 mt-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Residential Address</p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                            {selectedStudent.location || 'No verified address on record.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guardian Short Cards */}
                        {[
                            { data: parent1, label: "Primary Guardian", id: "p1" },
                            { data: parent2, label: "Secondary Guardian", id: "p2" }
                        ].filter(p => p.data).map((parent, idx) => (
                            <div key={parent.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <SectionHeader icon={faUserTie} title={parent.data.name} subtitle={parent.label} />
                                    <button 
                                        onClick={() => {
                                            setActiveParentForDrawer(parent.data);
                                            setShowParentDrawer(true);
                                        }} 
                                        className="p-2 hover:bg-slate-50 text-indigo-600 rounded-lg transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{parent.data.phone}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Mobile Number</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{parent.data.email || 'Not Provided'}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Email Address</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content (Right - 8 Columns) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* 1. Logistics Section (The Priority) */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <SectionHeader icon={faBus} title="Transport & Logistics" subtitle="Daily Commute Management" />
                                
                                {/* Transport Status Toggle */}
                                <button
                                    onClick={() => onTransportStatusUpdate(
                                        selectedStudent.id, 
                                        selectedStudent.originalData?.is_transport_user ? 'INACTIVE' : 'ACTIVE'
                                    )}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                                        selectedStudent.originalData?.is_transport_user 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold' 
                                        : 'bg-slate-50 text-slate-400 border-slate-100 font-bold'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedStudent.originalData?.is_transport_user ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                    <span className="text-[10px] uppercase tracking-widest">
                                        {selectedStudent.originalData?.is_transport_user ? 'Active Commuter' : 'Day Scholar'}
                                    </span>
                                </button>
                            </div>
                            
                            <div className="p-8">
                                {selectedStudent.originalData?.is_transport_user ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                                <FontAwesomeIcon icon={faClock} className="text-indigo-500 text-xs" />
                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Morning Pickup</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DataRow label="Route" value={transportData.pickupRoute?.route_name || 'Assigned'} />
                                                <DataRow label="Stop Name" value={transportData.pickupStop?.stop_name || 'Main Gate'} />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                                <FontAwesomeIcon icon={faRoute} className="text-rose-500 text-xs" />
                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Evening Drop</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <DataRow label="Route" value={transportData.dropRoute?.route_name || 'Assigned'} />
                                                <DataRow label="Drop Point" value={transportData.dropStop?.stop_name || 'Main Gate'} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                        <FontAwesomeIcon icon={faUser} className="text-slate-100 text-4xl mb-4" />
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Private Transport User</h4>
                                        <p className="text-xs font-medium text-slate-400 mt-2">School transport services are not active for this student.</p>
                                    </div>
                                )}
                            </div>
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
