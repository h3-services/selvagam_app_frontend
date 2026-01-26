import RecentMessages from './RecentMessages';
import ComposeMessage from './ComposeMessage';

const CommunicationHome = () => {
    // Mock Recent Messages
    const recentMessages = [
        { id: 1, to: 'All Drivers', type: 'text', content: 'Urgent: Road closure on Route 5 due to maintenance.', time: '10 mins ago', recipient: 'Drivers' },
        { id: 2, to: 'All Parents', type: 'audio', content: 'Voice Message: School Annual Day Update', time: '1 hour ago', recipient: 'Parents' },
        { id: 3, to: 'All Parents', type: 'text', content: 'School will be closed tomorrow due to heavy rain.', time: 'Yesterday', recipient: 'Parents' },
    ];

    return (
        <div className="h-full p-6 lg:p-8 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 ml-20 lg:ml-0">Communication Hub</h1>
                <p className="text-gray-500 text-sm mt-1 ml-20 lg:ml-0">Send updates and messages to drivers and parents.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <RecentMessages messages={recentMessages} />
                <ComposeMessage />
            </div>
        </div>
    );
};

export default CommunicationHome;
