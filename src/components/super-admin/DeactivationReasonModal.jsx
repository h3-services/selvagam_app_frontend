import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const DeactivationReasonModal = ({ show, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");

    // Reset reason when modal opens
    useEffect(() => {
        if (show) setReason("");
    }, [show]);

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 mx-auto">
                    <FontAwesomeIcon icon={faClock} className="text-2xl text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reason for Deactivation</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center">
                    Please provide a reason why this admin is being moved to inactive status.
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason here..."
                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 resize-none bg-gray-50/50 mb-6 min-h-[100px]"
                    autoFocus
                />
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${reason.trim()
                            ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeactivationReasonModal;
