import React from 'react';
import { SearchIcon, SparklesIcon, UserIcon, FileTextIcon, LogoutIcon, LockIcon, MailIcon, BookIcon, SettingsIcon, BriefcaseIcon } from './Icons';
import { ViewState, User } from '../types';

interface Props {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ currentView, setView, user, onLogout }) => {
  if (!user) return null; // Don't show sidebar on login screen

  const getLinkClass = (view: ViewState) => {
    const isActive = currentView === view || (view === 'discover' && currentView === 'detail');
    return isActive
      ? "flex items-center space-x-3 px-4 py-3 rounded-lg bg-dark-800 text-brand-400 font-medium cursor-pointer"
      : "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-gray-200 transition-colors cursor-pointer";
  };

  return (
    <aside id="sidebar-container" className="w-full md:w-64 bg-dark-900 border-r border-dark-700 flex flex-col fixed h-full z-10 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => setView('discover')}>
          <div className="bg-brand-600 p-1.5 rounded-lg">
             <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">OppBridge</h1>
        </div>

        <nav id="sidebar-nav" className="space-y-1">
          {user.role === 'seeker' && (
              <div onClick={() => setView('discover')} className={getLinkClass('discover')}>
                 <SearchIcon className="w-5 h-5" />
                 <span>Discover</span>
              </div>
          )}
          
          {user.role === 'seeker' && (
            <>
              <div id="nav-applications" onClick={() => setView('applications')} className={getLinkClass('applications')}>
                 <FileTextIcon className="w-5 h-5" />
                 <span>My Applications</span>
              </div>
              <div id="nav-profile" onClick={() => setView('profile')} className={getLinkClass('profile')}>
                 <UserIcon className="w-5 h-5" />
                 <span>Profile</span>
              </div>
              <div id="nav-resources" onClick={() => setView('resources')} className={getLinkClass('resources')}>
                <BookIcon className="w-5 h-5" />
                <span>Resources</span>
              </div>
            </>
          )}

          {/* Inbox Link (Everyone) */}
          <div id="nav-inbox" onClick={() => setView('inbox')} className={getLinkClass('inbox')}>
            <MailIcon className="w-5 h-5" />
            <span>Inbox</span>
          </div>
          
          {/* Company Links */}
          {user.role === 'company' && (
              <div onClick={() => setView('company_dashboard')} className={getLinkClass('company_dashboard')}>
                  <BriefcaseIcon className="w-5 h-5" />
                  <span>Company Dashboard</span>
              </div>
          )}

          {/* Admin Links */}
          {user.role === 'admin' && (
            <div id="nav-admin" onClick={() => setView('admin_dashboard')} className={getLinkClass('admin_dashboard')}>
              <LockIcon className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </div>
          )}

          {/* Settings (Everyone) */}
          <div id="nav-settings" onClick={() => setView('settings')} className={getLinkClass('settings')}>
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </div>

        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-dark-700 space-y-4">
         <div className="bg-dark-800 rounded-lg p-3 flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold">
               {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="text-sm font-medium text-white truncate">{user.name}</p>
               <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
         </div>

         <button 
           onClick={onLogout}
           className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-colors text-sm"
         >
           <LogoutIcon className="w-4 h-4" />
           <span>Sign Out</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
