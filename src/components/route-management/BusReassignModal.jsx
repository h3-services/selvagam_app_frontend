import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faTimes, faBus } from '@fortawesome/free-solid-svg-icons';

const BusReassignModal = ({
    show,
    onClose,
    onReassign,
    availableBuses,
    routes,
    reassigningRouteId,
    getStatusColor
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[1500]">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-2xl z-[1501] overflow-hidden">
                <div className="p-6 border-b border-blue-100" style={{ backgroundColor: '#3A7BFF' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <FontAwesomeIcon icon={faExchangeAlt} className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Reassign Bus</h3>
                                <p className="text-white/70 text-xs">Select a bus for this route</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-2">
                        {availableBuses.map((bus) => {
                            const currentRoute = routes.find(r => r.id === reassigningRouteId);
                            const isCurrentBus = currentRoute?.assignedBus === bus.busNumber;
                            return (
                                <button
                                    key={bus.busNumber}
                                    onClick={() => onReassign(reassigningRouteId, bus.busNumber)}
                                    disabled={bus.status !== 'Active'}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isCurrentBus
                                        ? 'border-blue-500 bg-blue-50'
                                        : bus.status === 'Active'
                                            ? 'border-gray-100 hover:border-purple-300 hover:bg-blue-50'
                                            : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bus.status === 'Active'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                                : 'bg-gray-300'
                                                }`}>
                                                <FontAwesomeIcon icon={faBus} className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{bus.busNumber}</span>
                                                    {isCurrentBus && (
                                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Current</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">{bus.driverName} • {bus.capacity} seats</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(bus.status)}`}>
                                            {bus.status}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusReassignModal;
