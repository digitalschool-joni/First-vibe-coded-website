import React, { useEffect, useState } from 'react';
import { Opportunity, OpportunityType, Category, Application, ApplicationStatus } from '../types';
import { createOpportunity, deleteOpportunity, getAllOpportunities, getAdminStats, getAllApplications, updateApplicationStatus } from '../services/mockDb';
import { TrashIcon, PlusIcon, ChartIcon, CheckCircleIcon, BriefcaseIcon, FileTextIcon } from './Icons';

interface Props {
  refreshTrigger: () => void;
}

type TabView = 'listings' | 'applications';

const AdminDashboard: React.FC<Props> = ({ refreshTrigger }) => {
  const [activeTab, setActiveTab] = useState<TabView>('listings');
  
  // Data State
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>({ totalOpportunities: 0, totalApplications: 0, activeUsers: 0 });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({
    type: OpportunityType.JOB,
    category: Category.TECH,
    is_remote: false,
    stipend_amount: 0
  });

  const fetchData = async () => {
    const [opps, apps, st] = await Promise.all([
        getAllOpportunities(),
        getAllApplications(),
        getAdminStats()
    ]);
    setOpportunities(opps);
    setApplications(apps);
    setStats(st);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this opportunity?')) {
      await deleteOpportunity(id);
      fetchData();
      refreshTrigger(); // Refresh main app data
    }
  };

  const handleStatusChange = async (appId: number, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(appId, newStatus);
    fetchData(); // Refresh data to reflect status change
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.organization) return;
    
    await createOpportunity(newOpp as any);
    setIsModalOpen(false);
    fetchData();
    refreshTrigger();
    // Reset form
    setNewOpp({ type: OpportunityType.JOB, category: Category.TECH, is_remote: false, stipend_amount: 0 });
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-blue-900 text-blue-300 border-blue-800';
      case ApplicationStatus.REVIEWING: return 'bg-yellow-900 text-yellow-300 border-yellow-800';
      case ApplicationStatus.OFFER: return 'bg-green-900 text-green-300 border-green-800';
      case ApplicationStatus.REJECTED: return 'bg-red-900 text-red-300 border-red-800';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        
        <div className="flex bg-dark-800 p-1 rounded-lg border border-dark-700">
           <button 
             onClick={() => setActiveTab('listings')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'listings' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
           >
             Manage Listings
           </button>
           <button 
             onClick={() => setActiveTab('applications')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'applications' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
           >
             Track Applications
           </button>
        </div>

        {activeTab === 'listings' && (
            <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-lg shadow-brand-900/20"
            >
            <PlusIcon className="w-5 h-5" />
            <span>Post Opportunity</span>
            </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Opportunities</h3>
              <ChartIcon className="w-5 h-5 text-brand-500" />
           </div>
           <p className="text-3xl font-bold text-white">{stats.totalOpportunities}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Applications</h3>
              <FileTextIcon className="w-5 h-5 text-blue-500" />
           </div>
           <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 p-6 rounded-xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Active Users</h3>
              <ChartIcon className="w-5 h-5 text-purple-500" />
           </div>
           <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
        </div>
      </div>

      {/* VIEW: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-dark-700">
            <h3 className="font-bold text-white">Active Opportunities</h3>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-dark-900 text-gray-400 text-sm uppercase">
                <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                {opportunities.map(opp => (
                    <tr key={opp.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{opp.title}</td>
                    <td className="px-6 py-4 text-gray-300">{opp.organization}</td>
                    <td className="px-6 py-4">
                        <span className="bg-dark-900 text-gray-300 px-2 py-1 rounded text-xs border border-dark-700">{opp.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                        onClick={() => handleDelete(opp.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded transition-colors"
                        >
                        <TrashIcon className="w-4 h-4" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {/* VIEW: APPLICATIONS */}
      {activeTab === 'applications' && (
          <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-dark-700">
               <h3 className="font-bold text-white">Application Tracker</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dark-900 text-gray-400 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Role / Opportunity</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                           <div className="h-8 w-8 rounded-full bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-300">
                              {app.applicant_name?.charAt(0) || 'U'}
                           </div>
                           <span className="text-white font-medium">{app.applicant_name || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{app.opportunity.title}</p>
                        <p className="text-gray-500 text-xs">{app.opportunity.organization}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                         {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                         <select 
                           value={app.status}
                           onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                           className={`bg-transparent border-0 text-xs font-bold uppercase rounded px-2 py-1 cursor-pointer focus:ring-0 ${getStatusColor(app.status)}`}
                         >
                            {Object.values(ApplicationStatus).map(s => (
                                <option key={s} value={s} className="bg-dark-800 text-gray-300">
                                    {s}
                                </option>
                            ))}
                         </select>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                      <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500">
                              No applications found yet.
                          </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-white mb-6">Post New Opportunity</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-gray-400 mb-1">Title</label>
                   <input required className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white" value={newOpp.title || ''} onChange={e => setNewOpp({...newOpp, title: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm text-gray-400 mb-1">Organization</label>
                   <input required className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white" value={newOpp.organization || ''} onChange={e => setNewOpp({...newOpp, organization: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white" value={newOpp.type} onChange={e => setNewOpp({...newOpp, type: e.target.value as OpportunityType})}>
                      {Object.values(OpportunityType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white" value={newOpp.category} onChange={e => setNewOpp({...newOpp, category: e.target.value as Category})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
              </div>

              <div>
                 <label className="block text-sm text-gray-400 mb-1">Location</label>
                 <input required className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white" value={newOpp.location || ''} onChange={e => setNewOpp({...newOpp, location: e.target.value})} />
              </div>

              <div>
                 <label className="block text-sm text-gray-400 mb-1">Description</label>
                 <textarea required className="w-full bg-dark-900 border border-dark-700 rounded p-2 text-white h-24" value={newOpp.description || ''} onChange={e => setNewOpp({...newOpp, description: e.target.value})} />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-500">Create Posting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
