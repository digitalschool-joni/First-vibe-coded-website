import React, { useEffect, useState } from 'react';
import { Notification } from '../types';
import { getMyNotifications, markNotificationRead } from '../services/mockDb';
import { MailIcon, CheckCircleIcon, SparklesIcon } from './Icons';

interface Props {
  userId: number;
}

const InboxView: React.FC<Props> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const data = await getMyNotifications(userId);
    // Sort by newest first
    setNotifications(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    setLoading(false);
  };

  const handleRead = async (id: number) => {
    await markNotificationRead(id);
    fetchData();
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
        case 'error': return <span className="w-2 h-2 rounded-full bg-red-500" />;
        default: return <MailIcon className="w-5 h-5 text-brand-400" />;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inbox...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Inbox</h1>
        <span className="bg-dark-800 text-gray-400 px-3 py-1 rounded-full text-sm">
            {notifications.filter(n => !n.is_read).length} Unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dashed border-dark-700">
           <MailIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
           <p className="text-gray-400 text-lg">Your inbox is empty.</p>
           <p className="text-gray-500 text-sm mt-2">Notifications about your applications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
                key={notif.id} 
                onClick={() => handleRead(notif.id)}
                className={`border rounded-xl p-6 transition-colors cursor-pointer relative overflow-hidden ${
                    notif.is_read 
                        ? 'bg-dark-800/40 border-dark-800' 
                        : 'bg-dark-800 border-brand-500/50'
                }`}
            >
                {/* Unread Indicator */}
                {!notif.is_read && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-brand-500 rounded-bl-lg shadow-lg shadow-brand-500/50"></div>
                )}

                <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${notif.is_read ? 'bg-dark-700' : 'bg-brand-900/30'}`}>
                        {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-lg font-bold mb-1 ${notif.is_read ? 'text-gray-300' : 'text-white'}`}>
                                {notif.title}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${notif.is_read ? 'text-gray-500' : 'text-gray-300'}`}>
                            {notif.message}
                        </p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxView;
