import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faTrash, faArrowLeft, faSpinner, faUsers, faChevronDown, faCheck, faUserCheck, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import DriverList from './DriverList';
import DriverDetail from './DriverDetail';
import AddDriverForm from './AddDriverForm';
import { driverService } from '../../services/driverService';

import { busService } from '../../services/busService';
import { routeService } from '../../services/routeService';

const DriverManagementHome = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'resigned'
    
    // Bulk Actions State
    const [selectedRows, setSelectedRows] = useState([]);
    const [showBulkMenu, setShowBulkMenu] = useState(false);


    // Fetch Drivers, Buses & Routes to map vehicles and routes
    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const [driversData, busesData, routesData] = await Promise.all([
                driverService.getAllDrivers(),
                busService.getAllBuses(),
                routeService.getAllRoutes()
            ]);

            // Create a lookup for bus (driver_id -> bus details)
            const driverBusMap = {};
            if (Array.isArray(busesData)) {
                busesData.forEach(bus => {
                    if (bus.driver_id) {
                        driverBusMap[bus.driver_id] = bus;
                    }
                });
            }

            // Create a lookup for route (route_id -> route name)
            const routeMap = {};
            if (Array.isArray(routesData)) {
                routesData.forEach(route => {
                    routeMap[route.route_id] = route.name;
                });
            }

            // Map API data to UI format
            const mappedDrivers = Array.isArray(driversData) ? driversData.map(d => {
                const assignedBus = driverBusMap[d.driver_id];
                const busNumber = assignedBus ? (assignedBus.registration_number || assignedBus.bus_number || 'Unknown Bus') : 'Unassigned';
                const routeName = assignedBus && assignedBus.route_id ? (routeMap[assignedBus.route_id] || 'Unknown Route') : 'Unassigned';

                return {
                    ...d,
                    id: d.driver_id,
                    mobile: d.phone, // UI uses mobile, API uses phone
                    licenseNumber: d.licence_number, // Note spelling
                    status: d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase()) : 'Inactive', // "ACTIVE" -> "Active"
                    date: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                    vehicleNumber: busNumber,
                    route: routeName
                };
            }) : [];
            setDrivers(mappedDrivers);
            setError(null);
        } catch (err) {
            setError('Failed to load drivers.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleToggleStatus = async (id, newStatus) => {
        const driver = drivers.find(d => d.id === id);
        if (!driver) return;

        const newStatusUI = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();

        // Optimistic update
        setDrivers(drivers.map(d =>
            d.id === id ? { ...d, status: newStatusUI } : d
        ));

        try {
            await driverService.updateDriverStatus(id, newStatus);
        } catch (err) {
            console.error(`Failed to update driver status to ${newStatus}:`, err);
            // Revert on error
            setDrivers(drivers.map(d =>
                d.id === id ? { ...d, status: driver.status } : d
            ));
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        if (!selectedRows.length) return;
        setLoading(true);
        try {
            await Promise.all(selectedRows.map(driver => 
                driverService.updateDriverStatus(driver.id, newStatus)
            ));
            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchDrivers();
        } catch (error) {
            console.error("Bulk status update failed:", error);
            // alert("Some updates failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedRows.length) return;
        if (!window.confirm(`Are you sure you want to archive ${selectedRows.length} fleet members?`)) return;
        
        setLoading(true);
        try {
            await Promise.all(selectedRows.map(driver => 
                driverService.updateDriverStatus(driver.id, 'RESIGNED')
            ));
            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchDrivers();
        } catch (error) {
            console.error("Bulk retirement failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDrivers = drivers.filter(d => {
        const matchesSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase());
        const isResignedStatus = d.status === 'Resigned';
        
        if (viewMode === 'resigned') {
            return matchesSearch && isResignedStatus;
        }
        return matchesSearch && !isResignedStatus;
    });

    const handleAdd = async (newDriver) => {
        setLoading(true);
        try {
            await driverService.createDriver(newDriver);
            await fetchDrivers(); // Refresh list to see new driver
            setShowModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await driverService.updateDriverStatus(itemToDelete, 'RESIGNED');
                setDrivers(prev => prev.map(d => 
                    d.id === itemToDelete ? { ...d, status: 'Resigned' } : d
                ));
                setShowDeleteConfirm(false);
                setItemToDelete(null);
            } catch (err) {
                console.error("Error setting driver as Resigned:", err);
            }
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            const apiPayload = {
                name: updatedData.name,
                email: updatedData.email,
                phone: Number(updatedData.mobile),
                dob: updatedData.dob,
                licence_number: updatedData.licenseNumber,
                licence_expiry: updatedData.licence_expiry,
                aadhar_number: updatedData.aadhar_number,
                photo_url: updatedData.photo_url,
                licence_url: updatedData.licence_url,
                aadhar_url: updatedData.aadhar_url,
                is_available: updatedData.is_available,
                status: updatedData.status
            };
            await driverService.updateDriver(updatedData.id, apiPayload);
            await fetchDrivers();
            setSelectedDriver(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#f1f5f9] relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                            {selectedDriver ? 'Driver Profile' : 'Driver Management'}
                        </h1>
                    </div>

                    {!selectedDriver && (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Premium Tab System */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => setViewMode('active')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        viewMode === 'active' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Active Personnel
                                </button>
                                <button
                                    onClick={() => setViewMode('resigned')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        viewMode === 'resigned' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Archived Records
                                </button>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search driver fleet..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-64 md:w-80 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all outline-none placeholder:text-slate-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-blue-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Loading drivers...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-red-100">
                         <p className="text-red-500 font-bold mb-4">{error}</p>
                         <button onClick={fetchDrivers} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Retry</button>
                    </div>
                ) : selectedDriver ? (
                    <DriverDetail
                        selectedDriver={selectedDriver}
                        onBack={() => setSelectedDriver(null)}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <DriverList
                        filteredDrivers={filteredDrivers}
                        setSelectedStudent={setSelectedDriver}
                        handleToggleStatus={handleToggleStatus}
                        handleDelete={handleDelete}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                        viewMode={viewMode}
                        onSelectionChanged={setSelectedRows}
                    />
                )}
            </div>

            {/* Bulk Actions Floating Pill */}
            {selectedRows.length > 0 && !selectedDriver && (
                <>
                    {showBulkMenu && (
                        <div 
                            className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-[2001] animate-in fade-in duration-500"
                            onClick={() => setShowBulkMenu(false)}
                        />
                    )}
                    
                    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2002] flex flex-col items-center gap-4">
                        {showBulkMenu && (
                            <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-2 w-64 animate-in slide-in-from-bottom-8 zoom-in duration-300 origin-bottom">
                                <div className="px-4 py-3 text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center justify-between mb-2">
                                    <span>Fleet Operations</span>
                                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[9px] shadow-sm">
                                        {selectedRows.length} Active
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duty Status</div>
                                    {[
                                        { label: 'Activate All', value: 'ACTIVE', icon: faUserCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50/50' },
                                        { label: 'Suspend All', value: 'INACTIVE', icon: faUserClock, color: 'text-amber-500', bgColor: 'bg-amber-50/50' }
                                    ].map(opt => (
                                        <button 
                                            key={opt.value}
                                            onClick={() => handleBulkStatusUpdate(opt.value)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-black text-slate-700 hover:bg-slate-50 rounded-xl transition-all group"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <FontAwesomeIcon icon={opt.icon} className={`text-sm ${opt.color}`} />
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                    
                                    <div className="h-px bg-slate-100 my-2 mx-2" />
                                    <button 
                                        onClick={handleBulkDelete}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-rose-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                        </div>
                                        Archive Selected
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <button
                            onClick={() => setShowBulkMenu(!showBulkMenu)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all active:scale-95 group border-2 ${
                                showBulkMenu 
                                ? 'bg-slate-900 border-slate-700 text-white' 
                                : 'bg-white border-white text-blue-600 hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)]'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                showBulkMenu ? 'bg-white/10' : 'bg-slate-900 text-white'
                            }`}>
                                <FontAwesomeIcon icon={showBulkMenu ? faCheck : faUsers} className="text-[10px]" />
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${showBulkMenu ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {selectedRows.length} Selected
                                </span>
                                <span className={`text-[12px] font-black mt-0.5 ${showBulkMenu ? 'text-white' : 'text-slate-900'}`}>
                                    {showBulkMenu ? 'Close Protocol' : 'Personnel Actions'}
                                </span>
                            </div>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                className={`text-[10px] transition-transform duration-300 ml-2 ${showBulkMenu ? 'rotate-180 text-slate-400' : 'text-slate-300'}`} 
                            />
                        </button>
                    </div>
                </>
            )}

            {!selectedDriver && !loading && viewMode === 'active' && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 text-white rounded-[2rem] shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center z-40 transform hover:-translate-y-1"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-2xl" />
                </button>
            )}

            <AddDriverForm
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-rose-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faTrash} className="text-3xl text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Archive Personnel</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                Are you sure you want to <span className="font-black text-rose-600">Archive</span> this personnel? This action will move them from the active fleet to the archived registry.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverManagementHome;
