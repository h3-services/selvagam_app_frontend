import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
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
    const navigate = useNavigate();
    const { driverId, status: statusSlug } = useParams();

    const statusSlugMap = useMemo(() => ({
        'active': 'active',
        'resigned': 'resigned'
    }), []);

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'resigned'

    // Sync viewMode with URL status parameter
    useEffect(() => {
        if (statusSlug && statusSlugMap[statusSlug]) {
            setViewMode(statusSlugMap[statusSlug]);
        } else if (!statusSlug && location.pathname === '/drivers') {
            setViewMode('active');
        }
    }, [statusSlug, location.pathname, statusSlugMap]);

    const handleTabChange = (mode) => {
        const slug = mode === 'active' ? 'active' : 'resigned';
        navigate(`/drivers/view/${slug}`);
    };

    // Derived States
    const isAddPath = location.pathname === '/drivers/add';
    const isEditPath = !!driverId && location.pathname.endsWith('/edit');
    const isDetailPath = !!driverId && location.pathname.endsWith('/detail');
    const search = searchParams.get('search') || "";

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingDriver, setEditingDriver] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    
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

    // Synchronize selectedDriver and editingDriver when URL changes
    useEffect(() => {
        if (drivers.length > 0) {
            if (driverId) {
                const driver = drivers.find(d => d.id === driverId);
                if (driver) {
                    if (isEditPath) {
                        setEditingDriver(driver);
                        setSelectedDriver(null);
                    } else if (isDetailPath) {
                        setSelectedDriver(driver);
                        setEditingDriver(null);
                    }
                }
            } else {
                setSelectedDriver(null);
                setEditingDriver(null);
            }
        }
    }, [driverId, isEditPath, isDetailPath, drivers]);

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

    const handleAdd = async (newDriverData) => {
        setLoading(true);
        try {
            const payload = {
                name: newDriverData.name,
                phone: newDriverData.phone,
                email: newDriverData.email,
                licence_number: newDriverData.licence_number,
                licence_expiry: newDriverData.licence_expiry,
                fcm_token: newDriverData.fcm_token,
                password: newDriverData.password
            };
            await driverService.createDriver(payload);
            await fetchDrivers(); 
            navigate('/drivers');
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

    const handleStatusChange = async (driverId, newStatus) => {
        try {
            await driverService.updateDriverStatus(driverId, newStatus);
            await fetchDrivers(); // Refresh the list
            
            // Re-sync selected driver
            if (selectedDriver) {
                const refreshed = (await driverService.getAllDrivers()).find(d => d.driver_id === driverId);
                if (refreshed) {
                    setSelectedDriver({
                        ...refreshed,
                        id: refreshed.driver_id,
                        mobile: refreshed.phone,
                        licenseNumber: refreshed.licence_number
                    });
                }
            }
        } catch (err) {
            console.error("Error updating personnel status:", err);
        }
    };

    const handleUpdate = async (updatedData) => {
        setLoading(true);
        try {
            const apiPayload = {
                name: updatedData.name,
                phone: Number(updatedData.phone || updatedData.mobile),
                email: updatedData.email,
                licence_number: updatedData.licence_number || updatedData.licenseNumber,
                licence_expiry: updatedData.licence_expiry,
                fcm_token: updatedData.fcm_token || 'string', // 'string' as per example if empty
                status: (updatedData.status || 'ACTIVE').toUpperCase()
            };
            await driverService.updateDriver(updatedData.id, apiPayload);
            await fetchDrivers();
            
            // Re-sync selected driver if it's the one we just updated
            if (selectedDriver && selectedDriver.id === updatedData.id) {
                const refreshed = (await driverService.getAllDrivers()).find(d => d.driver_id === updatedData.id);
                if (refreshed) {
                    setSelectedDriver({
                        ...refreshed,
                        id: refreshed.driver_id,
                        mobile: refreshed.phone,
                        licenseNumber: refreshed.licence_number
                    });
                }
            }
            
            navigate(isDetailPath ? `/drivers/${updatedData.id}/detail` : '/drivers');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (driver) => {
        navigate(`/drivers/${driver.id}/edit`);
    };

    const handleViewDetail = (driver) => {
        navigate(`/drivers/${driver.id}/detail`);
    };

    const handleSearchChange = (value) => {
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            {!selectedDriver && (
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className='ml-14 lg:ml-0'>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Driver Management
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Premium Tab System */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => handleTabChange('active')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        viewMode === 'active' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Active Drivers
                                </button>
                                <button
                                    onClick={() => handleTabChange('resigned')}
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
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Content */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                             <p className="text-red-500 font-bold mb-4">{error}</p>
                             <button onClick={fetchDrivers} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Retry</button>
                        </div>
                    ) : selectedDriver ? (
                        <DriverDetail
                            selectedDriver={selectedDriver}
                            onBack={() => navigate('/drivers')}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <DriverList
                            filteredDrivers={filteredDrivers}
                            setSelectedStudent={handleViewDetail}
                            handleToggleStatus={handleToggleStatus}
                            handleDelete={handleDelete}
                            activeMenuId={activeMenuId}
                            setActiveMenuId={setActiveMenuId}
                            viewMode={viewMode}
                            onSelectionChanged={setSelectedRows}
                        />
                    )}
                </div>
            </div>

            {/* Bulk Actions Floating Pill */}
            {selectedRows.length > 0 && !selectedDriver && (
                <>
                    {showBulkMenu && (
                        <div 
                            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[99999] animate-in fade-in duration-500"
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
                                    {showBulkMenu ? 'Close' : 'Actions'}
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
                    onClick={() => navigate('/drivers/add')}
                    className="fixed bottom-8 right-8 w-16 h-16 text-white rounded-[2rem] shadow-2xl hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center z-40 transform hover:-translate-y-1"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-2xl" />
                </button>
            )}

            <AddDriverForm
                show={isAddPath || isEditPath}
                onClose={() => {
                    navigate(isEditPath ? `/drivers/${driverId}/detail` : '/drivers');
                    setEditingDriver(null);
                }}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                initialData={editingDriver}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-rose-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faTrash} className="text-3xl text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Deactivate Driver</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                Are you sure you want to <span className="font-black text-rose-600">deactivate</span> this driver? They will be moved to the inactive list.
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
