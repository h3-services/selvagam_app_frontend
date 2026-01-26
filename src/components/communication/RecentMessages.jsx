import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

const RecentMessages = ({ messages }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-6 flex flex-col overflow-hidden">
            <h2 className="font-bold text-gray-800 text-lg mb-6">Recent Messages</h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${msg.recipient === 'Drivers' || msg.recipient === 'Driver' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                                {msg.recipient}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{msg.time}</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">{msg.to}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FontAwesomeIcon icon={msg.type === 'audio' ? faVolumeUp : faAlignLeft} />
                            <span className="truncate">{msg.content}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMessages;
