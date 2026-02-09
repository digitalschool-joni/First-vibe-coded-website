import React from 'react';
import { Opportunity, OpportunityType } from '../types';
import { BriefcaseIcon, GraduationCapIcon, SparklesIcon } from './Icons';

interface Props {
  data: Opportunity;
  onClick: (opp: Opportunity) => void;
}

const getIcon = (type: OpportunityType) => {
  switch (type) {
    case OpportunityType.SCHOLARSHIP: return <GraduationCapIcon className="w-5 h-5 text-yellow-400" />;
    case OpportunityType.INTERNSHIP: return <BriefcaseIcon className="w-5 h-5 text-blue-400" />;
    case OpportunityType.JOB: return <BriefcaseIcon className="w-5 h-5 text-green-400" />;
    default: return <SparklesIcon className="w-5 h-5 text-purple-400" />;
  }
};

const OpportunityCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <div 
      onClick={() => onClick(data)}
      className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-900/20 transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {data.logo_url ? (
             <img 
               src={data.logo_url} 
               alt={data.organization} 
               className="w-12 h-12 rounded-lg object-cover bg-white border border-dark-600"
             />
          ) : (
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-inner ${data.logo_color || 'bg-brand-600'}`}>
              {data.organization.charAt(0)}
            </div>
          )}
          
          <div>
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-brand-400 transition-colors line-clamp-1">{data.title}</h3>
              <p className="text-sm text-gray-400">{data.organization}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
         <span className="flex items-center space-x-1 px-2 py-1 bg-dark-900 rounded text-xs text-gray-300 border border-dark-700">
            {getIcon(data.type)}
            <span>{data.type}</span>
         </span>
         {data.stipend_amount > 0 && (
           <span className="bg-brand-900/40 text-brand-300 text-xs px-2 py-1 rounded border border-brand-800/50 font-medium">
             ${data.stipend_amount.toLocaleString()}
           </span>
         )}
         {data.is_remote && (
             <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded border border-blue-800/50">Remote</span>
         )}
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
        {data.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-dark-700 pt-3 mt-auto">
        <span>{data.location}</span>
        <span className="text-brand-400 font-medium flex items-center group-hover:translate-x-1 transition-transform">
          View Details →
        </span>
      </div>
    </div>
  );
};

export default OpportunityCard;
