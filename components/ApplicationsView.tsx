import React, { useEffect, useState } from 'react';
import { Application, ApplicationStatus } from '../types';
import { getMyApplications } from '../services/mockDb';
import { BriefcaseIcon } from './Icons';

interface Props {
  userId: number;
}

const ApplicationsView: React.FC<Props> = ({ userId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications(userId).then(apps => {
      setApplications(apps);
      setLoading(false);
    });
  }, [userId]);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-blue-900 text-blue-300 border-blue-800';
      case ApplicationStatus.REVIEWING: return 'bg-yellow-900 text-yellow-300 border-yellow-800';
      case ApplicationStatus.OFFER: return 'bg-green-900 text-green-300 border-green-800';
      case ApplicationStatus.REJECTED: return 'bg-red-900 text-red-300 border-red-800';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading applications...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-white mb-8">My Applications</h1>
      
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dashed border-dark-700">
           <BriefcaseIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
           <p className="text-gray-400 text-lg">You haven't applied to any opportunities yet.</p>
           <p className="text-gray-500 text-sm mt-2">Go to Discover to find your next role.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{app.opportunity.title}</h3>
                <p className="text-gray-400">{app.opportunity.organization}</p>
                <p className="text-xs text-gray-500 mt-1">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                <button className="text-sm text-gray-400 hover:text-white font-medium">
                  View Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsView;
