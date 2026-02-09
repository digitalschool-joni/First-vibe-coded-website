import React, { useState } from 'react';
import { Opportunity, ViewState } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, FileTextIcon } from './Icons';
import { applyForOpportunity } from '../services/mockDb';

interface Props {
  data: Opportunity;
  userId: number;
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const OpportunityDetail: React.FC<Props> = ({ data, userId, onBack, onNavigate }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyForOpportunity(data.id, userId);
      setApplied(true);
    } catch (e) {
      console.error(e);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Fixed Bottom Success Toast */}
      {applied && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-dark-800 border border-brand-500 shadow-2xl shadow-brand-900/50 rounded-xl p-4 flex items-center space-x-4 max-w-sm">
            <div className="bg-brand-500/20 p-2 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <p className="font-bold text-white">Application Submitted!</p>
              <button 
                onClick={() => onNavigate('applications')}
                className="text-sm text-brand-400 hover:text-brand-300 font-medium hover:underline"
              >
                View in My Applications &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Results
      </button>

      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Banner */}
        <div className={`h-32 ${data.logo_color || 'bg-brand-600'} w-full opacity-20`}></div>
        
        <div className="p-8 -mt-12 relative">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
             {/* Logo Section */}
             {data.logo_url ? (
                <img 
                  src={data.logo_url} 
                  alt={data.organization} 
                  className="w-24 h-24 rounded-2xl shadow-xl border-4 border-dark-800 object-cover bg-white"
                />
             ) : (
                <div className={`w-24 h-24 ${data.logo_color || 'bg-brand-600'} rounded-2xl shadow-xl flex items-center justify-center text-4xl font-bold text-white border-4 border-dark-800`}>
                  {data.organization.charAt(0)}
                </div>
             )}

             <div className="flex-1 pt-2">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{data.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-gray-400 text-lg">
                    <span className="font-semibold text-white">{data.organization}</span>
                    <span>•</span>
                    <span>{data.location} {data.is_remote && '(Remote)'}</span>
                    <span className="px-3 py-0.5 bg-dark-700 text-brand-300 text-xs uppercase font-bold rounded-full border border-dark-600">{data.type}</span>
                </div>
             </div>

             <div className="pt-2">
                {applied ? (
                   <button 
                     onClick={() => onNavigate('applications')}
                     className="bg-dark-700 text-white border border-brand-500 px-8 py-3 rounded-xl font-bold flex items-center space-x-2 w-full md:w-auto justify-center hover:bg-dark-600 transition-colors"
                   >
                      <CheckCircleIcon className="w-5 h-5 text-brand-400" />
                      <span>View Status</span>
                   </button>
                ) : (
                   <button 
                     onClick={handleApply}
                     disabled={applying}
                     className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-900/20 disabled:opacity-50 w-full md:w-auto"
                   >
                     {applying ? 'Submitting...' : 'Apply Now'}
                   </button>
                )}
             </div>
          </div>
          
          {/* Prominent Success Banner In-Content */}
          {applied && (
              <div className="mb-8 bg-brand-900/20 border border-brand-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center space-x-4">
                      <div className="bg-brand-500 p-2 rounded-lg">
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-white">Application Sent Successfully!</h3>
                          <p className="text-brand-200 text-sm">The organization has received your details. You can track this application in your dashboard.</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('applications')}
                    className="whitespace-nowrap px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center"
                  >
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Go to My Applications
                  </button>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    Description
                </h3>
                <div className="bg-dark-900/30 p-6 rounded-xl border border-dark-700/50">
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {data.description}
                    </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-3">Requirements</h3>
                <ul className="grid grid-cols-1 gap-3">
                  {data.requirements?.map((req, i) => (
                    <li key={i} className="flex items-start text-gray-300 bg-dark-900/30 p-3 rounded-lg border border-dark-700/50">
                       <CheckCircleIcon className="w-5 h-5 mr-3 text-brand-500 mt-0.5 flex-shrink-0" />
                       {req}
                    </li>
                  )) || <li className="text-gray-500">No specific requirements listed.</li>}
                </ul>
              </section>
            </div>

            <div className="bg-dark-900/50 p-6 rounded-xl border border-dark-700 h-fit space-y-6">
              <h4 className="font-bold text-white text-lg mb-2">Job Overview</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compensation</span>
                <span className="text-white font-medium bg-dark-800 px-2 py-1 rounded">
                  {data.stipend_amount > 0 ? `$${data.stipend_amount.toLocaleString()}` : 'Unpaid'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Deadline</span>
                <span className="text-white font-medium text-right text-sm">
                  {new Date(data.deadline).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Category</span>
                <span className="text-white font-medium">{data.category}</span>
              </div>
              
              <div className="pt-4 border-t border-dark-700">
                 <p className="text-xs text-gray-500 mb-2">Share this opportunity</p>
                 <div className="flex gap-2">
                     <button className="flex-1 bg-dark-800 hover:bg-dark-700 py-2 rounded text-xs text-gray-300 transition-colors">Copy Link</button>
                     <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded text-xs text-white transition-colors">LinkedIn</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
