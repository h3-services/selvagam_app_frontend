import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import RecentMessages from './RecentMessages';
import ComposeMessage from './ComposeMessage';

const CommunicationHome = () => {
    // Mock Recent Messages
    const recentMessages = [
        { id: 2, to: 'All Parents', type: 'audio', content: 'Voice Message: School Annual Day Update', time: '1 hour ago', recipient: 'Parents' },
        { id: 3, to: 'All Parents', type: 'text', content: 'School will be closed tomorrow due to heavy rain.', time: 'Yesterday', recipient: 'Parents' },
    ];

    return (
        <div className="h-full p-6 lg:p-8 flex flex-col">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 ml-20 lg:ml-0">Communication Hub</h1>
                    <p className="text-gray-500 text-sm mt-1 ml-20 lg:ml-0">Broadcast updates and emergency notifications.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-pink-100 shadow-sm self-start md:self-auto">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest leading-none mb-1">Target Recipient Group</p>
                        <p className="text-sm font-bold text-gray-800">All Registered Parents</p>
                    </div>
                    <div className="ml-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <RecentMessages messages={recentMessages} />
                <ComposeMessage />
            </div>
        </div>
    );
};

export default CommunicationHome;
