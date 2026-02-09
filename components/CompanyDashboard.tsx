import React, { useEffect, useState } from 'react';
import { Opportunity, Application, ApplicationStatus, User } from '../types';
import { getCompanyOpportunities, getCompanyApplications, updateApplicationStatus, sendMessageToApplicant, createOpportunity } from '../services/mockDb';
import { BriefcaseIcon, UserIcon, MailIcon, CheckCircleIcon, PlusIcon } from './Icons';

interface Props {
  user: User;
}

const CompanyDashboard: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'applicants'>('listings');
  const [listings, setListings] = useState<Opportunity[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  
  // Message Modal State
  const [messageModal, setMessageModal] = useState<{isOpen: boolean, appId: number | null}>({isOpen: false, appId: null});
  const [messageText, setMessageText] = useState('');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOppTitle, setNewOppTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
      const myOps = await getCompanyOpportunities(user.id);
      setListings(myOps);
      const myApps = await getCompanyApplications(user.id);
      setApplicants(myApps);
  };

  const handleStatusChange = async (appId: number, newStatus: ApplicationStatus) => {
      await updateApplicationStatus(appId, newStatus);
      fetchData();
  };

  const openMessageModal = (appId: number) => {
      setMessageModal({ isOpen: true, appId });
      setMessageText('');
  };

  const handleSendMessage = async () => {
      if(messageModal.appId && messageText) {
          await sendMessageToApplicant(messageModal.appId, messageText);
          setMessageModal({ isOpen: false, appId: null });
          alert("Message sent to applicant!");
      }
  };

  // Simplified Create for demo
  const handleQuickCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      await createOpportunity({
          title: newOppTitle,
          organization: user.name, // Use company user name as org
          type: "Entry Level Job" as any,
          category: "Technology" as any,
          location: "Remote",
          is_remote: true,
          stipend_amount: 50000,
          deadline: "2024-12-31",
          description: "A great opportunity.",
          posted_by_user_id: user.id
      } as any);
      setIsCreateOpen(false);
      setNewOppTitle('');
      fetchData();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
                <p className="text-gray-400">Manage your postings and talent pipeline.</p>
            </div>
            
            <button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Post Job
            </button>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-dark-700">
            <button 
                onClick={() => setActiveTab('listings')}
                className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'listings' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-gray-500 hover:text-white'}`}
            >
                My Listings ({listings.length})
            </button>
            <button 
                onClick={() => setActiveTab('applicants')}
                className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'applicants' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-gray-500 hover:text-white'}`}
            >
                Applicants ({applicants.length})
            </button>
        </div>

        {activeTab === 'listings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(opp => (
                    <div key={opp.id} className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-white text-lg">{opp.title}</h3>
                             <span className="text-xs bg-dark-900 px-2 py-1 rounded text-gray-400">{opp.type}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Posted: {new Date(opp.posted_at || '').toLocaleDateString()}</p>
                        <div className="flex justify-between items-center border-t border-dark-700 pt-4">
                            <span className="text-sm text-gray-400">{applicants.filter(a => a.opportunity_id === opp.id).length} Applicants</span>
                            <button className="text-brand-400 hover:underline text-sm font-medium">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'applicants' && (
            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-dark-900 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Candidate</th>
                            <th className="px-6 py-4">Applied For</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                        {applicants.map(app => (
                            <tr key={app.id} className="hover:bg-dark-700/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center text-brand-300 font-bold text-xs">
                                            {app.applicant_name?.charAt(0)}
                                        </div>
                                        <span className="text-white font-medium">{app.applicant_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300 text-sm">
                                    {app.opportunity.title}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                        className="bg-dark-900 border border-dark-600 text-gray-300 text-xs rounded px-2 py-1"
                                    >
                                        {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => openMessageModal(app.id)}
                                        className="text-gray-400 hover:text-brand-400 transition-colors"
                                        title="Message Applicant"
                                    >
                                        <MailIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {applicants.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No applicants yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        {/* Message Modal */}
        {messageModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Message Applicant</h3>
                    <textarea 
                        value={messageText} 
                        onChange={e => setMessageText(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded p-3 text-white h-32 mb-4"
                        placeholder="Write your message here..."
                    ></textarea>
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setMessageModal({isOpen: false, appId: null})} className="text-gray-400">Cancel</button>
                        <button onClick={handleSendMessage} className="bg-brand-600 text-white px-4 py-2 rounded">Send Message</button>
                    </div>
                </div>
            </div>
        )}

        {/* Quick Create Modal (Simplified) */}
        {isCreateOpen && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-md p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Post New Job</h3>
                    <input 
                        value={newOppTitle}
                        onChange={e => setNewOppTitle(e.target.value)}
                        placeholder="Job Title"
                        className="w-full bg-dark-900 border border-dark-700 rounded p-3 text-white mb-4"
                    />
                     <div className="flex justify-end space-x-3">
                        <button onClick={() => setIsCreateOpen(false)} className="text-gray-400">Cancel</button>
                        <button onClick={handleQuickCreate} className="bg-brand-600 text-white px-4 py-2 rounded">Post</button>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

export default CompanyDashboard;
