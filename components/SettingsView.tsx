import React, { useState, useEffect } from 'react';
import { SettingsIcon, CheckCircleIcon, BellIcon, LockIcon } from './Icons';
import { User } from '../types';

interface Props {
  user: User;
}

const SettingsView: React.FC<Props> = ({ user }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [saved, setSaved] = useState(false);

  // Toggle Dark Mode (Manipulate DOM)
  useEffect(() => {
    const html = document.querySelector('html');
    if (darkMode) {
        html?.classList.add('dark');
        document.body.style.backgroundColor = '#0f172a';
    } else {
        html?.classList.remove('dark');
        document.body.style.backgroundColor = '#f1f5f9';
    }
  }, [darkMode]);

  const handleSave = () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center space-x-3 mb-8">
            <div className="bg-dark-800 p-2 rounded-lg border border-dark-700">
                <SettingsIcon className="w-6 h-6 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
            
            {/* Appearance */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50">
                    <h3 className="font-bold text-white flex items-center">
                        Appearance
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-400">Toggle dark theme for the application.</p>
                        </div>
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-brand-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50">
                    <h3 className="font-bold text-white flex items-center">
                        <BellIcon className="w-4 h-4 mr-2 text-gray-400" />
                        Notifications
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-400">Receive updates about your applications via email.</p>
                        </div>
                        <button 
                            onClick={() => setEmailNotifs(!emailNotifs)}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${emailNotifs ? 'bg-brand-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${emailNotifs ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-dark-900/50">
                    <h3 className="font-bold text-white flex items-center">
                        <LockIcon className="w-4 h-4 mr-2 text-gray-400" />
                        Privacy
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Public Profile</p>
                            <p className="text-sm text-gray-400">Allow employers to search and view your profile.</p>
                        </div>
                        <button 
                            onClick={() => setPublicProfile(!publicProfile)}
                            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${publicProfile ? 'bg-brand-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${publicProfile ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center"
                >
                    {saved ? (
                        <>
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Saved!
                        </>
                    ) : (
                        "Save Preferences"
                    )}
                </button>
            </div>

        </div>
    </div>
  );
};

export default SettingsView;
