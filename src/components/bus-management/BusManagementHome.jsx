import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBus, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import BusList from './BusList';
import BusDetail from './BusDetail';
import AddBusForm from './AddBusForm';

const BusManagementHome = () => {
    const [buses, setBuses] = useState([
        { id: 1, busNumber: 'BUS-101', capacity: 40, driverName: 'Robert Wilson', contactNumber: '555-0101', route: 'Route A - Downtown', status: 'Active' },
        { id: 2, busNumber: 'BUS-102', capacity: 40, driverName: 'Sarah Martinez', contactNumber: '555-0102', route: 'Route B - Westside', status: 'Active' },
        { id: 3, busNumber: 'BUS-103', capacity: 35, driverName: 'David Brown', contactNumber: '555-0103', route: 'Route C - North Hills', status: 'Maintenance' },
        { id: 4, busNumber: 'BUS-104', capacity: 40, driverName: 'Emily Davis', contactNumber: '555-0104', route: 'Route D - Eastgate', status: 'Active' },
        { id: 5, busNumber: 'BUS-105', capacity: 30, driverName: 'Michael Chen', contactNumber: '555-0105', route: 'Route E - Southpark', status: 'Inactive' },
        { id: 6, busNumber: 'BUS-106', capacity: 40, driverName: 'Jessica Taylor', contactNumber: '555-0106', route: 'Route F - Central', status: 'Active' },
        { id: 7, busNumber: 'BUS-107', capacity: 40, driverName: 'William Anderson', contactNumber: '555-0107', route: 'Route G - Harbor', status: 'Active' },
        { id: 8, busNumber: 'BUS-108', capacity: 35, driverName: 'Olivia Thomas', contactNumber: '555-0108', route: 'Route H - University', status: 'Maintenance' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBus, setSelectedBus] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredBuses = useMemo(() => {
        return buses.filter(b =>
            b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
            b.driverName.toLowerCase().includes(search.toLowerCase())
        );
    }, [buses, search]);

    const handleAdd = (newBus) => {
        setBuses([...buses, {
            id: Date.now(),
            ...newBus
        }]);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setBuses(buses.filter(b => b.id !== itemToDelete));
            setItemToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setBuses(buses.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    const handleUpdate = (updatedData) => {
        setBuses(buses.map(b => b.id === updatedData.id ? updatedData : b));
        setSelectedBus(updatedData);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Bus Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Manage fleet and assign drivers</p>
                </div>
                <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
                    <input
                        type="text"
                        placeholder="Search buses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {!selectedBus && (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
                    <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
                        <div className="relative w-full lg:w-96 hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search buses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            {selectedBus && (
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => setSelectedBus(null)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-gray-500">Back to List</span>
                        <span style={{ color: '#40189d' }}>/</span>
                        <span style={{ color: '#40189d' }}>{selectedBus.busNumber}</span>
                    </div>
                </div>
            )}

            {selectedBus ? (
                <BusDetail
                    selectedBus={selectedBus}
                    onBack={() => setSelectedBus(null)}
                    onUpdate={handleUpdate}
                    getStatusColor={getStatusColor}
                />
            ) : (
                <BusList
                    filteredBuses={filteredBuses}
                    setSelectedBus={setSelectedBus}
                    handleStatusChange={handleStatusChange}
                    handleDelete={handleDelete}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    getStatusColor={getStatusColor}
                />
            )}

            {!selectedBus && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faBus} className="text-xl sm:text-2xl" />
                </button>
            )}

            <AddBusForm
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
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete this bus record? This action cannot be undone and will remove all associated data.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusManagementHome;
