import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, updateUserProfile } from '../services/mockDb';
import { parseResumeText } from '../services/geminiService';
import { UserIcon, FileTextIcon, SparklesIcon, AlertIcon } from './Icons';

interface Props {
  userId: number;
}

const ProfileView: React.FC<Props> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  
  // Confirmation State
  const [showConfirm, setShowConfirm] = useState<'save' | 'cancel' | null>(null);
  
  // Resume Parsing State
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showParser, setShowParser] = useState(false);

  useEffect(() => {
    getUserProfile(userId).then(p => {
      setProfile(p);
      setFormData(p);
    });
  }, [userId]);

  const hasChanges = () => {
    if (!profile) return false;
    return JSON.stringify(formData) !== JSON.stringify(profile);
  };

  const handleActionAttempt = (action: 'save' | 'cancel') => {
      if (action === 'cancel' && hasChanges()) {
          setShowConfirm('cancel');
      } else if (action === 'save' && hasChanges()) {
          setShowConfirm('save');
      } else if (action === 'cancel') {
          // No changes, just cancel
          setIsEditing(false);
      } else {
          // No changes, but somehow clicked save? Just exit
          setIsEditing(false);
      }
  };

  const confirmAction = async () => {
      if (showConfirm === 'save') {
        setSaving(true);
        const updated = await updateUserProfile(formData);
        setProfile(updated);
        setIsEditing(false);
        setSaving(false);
      } else if (showConfirm === 'cancel') {
          setFormData(profile!); // Revert changes
          setIsEditing(false);
      }
      setShowConfirm(null);
  };

  const handleResumeParse = async () => {
    if(!resumeText) return;
    setIsParsing(true);
    try {
      const parsedData = await parseResumeText(resumeText);
      setFormData(prev => ({
        ...prev,
        bio: parsedData.bio || prev.bio,
        skills: parsedData.skills || prev.skills,
        experience: parsedData.experience || prev.experience
      }));
      setShowParser(false);
      setIsEditing(true); // Switch to edit mode to review changes
    } catch (e) {
      alert("Failed to parse resume. Ensure your API Key is valid.");
    } finally {
      setIsParsing(false);
    }
  };

  if (!profile) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-sm p-6 shadow-2xl">
                 <div className="flex items-center space-x-3 mb-4">
                     <AlertIcon className="w-8 h-8 text-yellow-500" />
                     <h3 className="text-xl font-bold text-white">
                         {showConfirm === 'save' ? 'Save Changes?' : 'Discard Changes?'}
                     </h3>
                 </div>
                 <p className="text-gray-400 text-sm mb-6">
                     {showConfirm === 'save' 
                        ? 'Are you sure you want to update your profile with these changes?' 
                        : 'You have unsaved changes. Are you sure you want to discard them?'}
                 </p>
                 <div className="flex justify-end space-x-3">
                     <button 
                       onClick={() => setShowConfirm(null)} 
                       className="px-4 py-2 text-gray-400 hover:text-white"
                     >
                         Keep Editing
                     </button>
                     <button 
                       onClick={confirmAction}
                       className={`px-4 py-2 rounded-lg font-medium text-white ${showConfirm === 'save' ? 'bg-brand-600 hover:bg-brand-500' : 'bg-red-600 hover:bg-red-500'}`}
                     >
                         {showConfirm === 'save' ? 'Yes, Save' : 'Yes, Discard'}
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* Resume Parser Modal */}
      {showParser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
              <SparklesIcon className="w-5 h-5 text-brand-400 mr-2" />
              AI Resume Import
            </h3>
            <p className="text-gray-400 text-sm mb-4">Paste the text content of your resume below. Our AI will extract your skills, bio, and experience.</p>
            <textarea 
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste resume text here..."
              className="w-full h-48 bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-white focus:border-brand-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowParser(false)} className="text-gray-400 hover:text-white px-3 py-2">Cancel</button>
              <button 
                onClick={handleResumeParse}
                disabled={isParsing || !resumeText}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50"
              >
                {isParsing ? 'Analyzing...' : 'Auto-Fill Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowParser(true)}
            className="px-4 py-2 rounded-lg font-medium bg-dark-800 text-brand-400 border border-dark-700 hover:bg-dark-700 transition-colors flex items-center"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Import CV
          </button>
          
          {isEditing ? (
              <>
                 <button 
                   onClick={() => handleActionAttempt('cancel')}
                   disabled={saving}
                   className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => handleActionAttempt('save')}
                   disabled={saving}
                   className="px-6 py-2 rounded-lg font-medium bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                 >
                   {saving ? 'Saving...' : 'Save Changes'}
                 </button>
              </>
          ) : (
            <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 rounded-lg font-medium bg-dark-800 text-gray-300 hover:bg-dark-700 transition-colors"
          >
            Edit Profile
          </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 text-center">
            <div className="w-24 h-24 bg-brand-900 text-brand-300 rounded-full mx-auto flex items-center justify-center mb-4">
              <UserIcon className="w-10 h-10" />
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white text-center focus:border-brand-500 focus:outline-none"
                  placeholder="Full Name"
                />
                 <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-gray-400 text-sm text-center focus:border-brand-500 focus:outline-none"
                  placeholder="Email"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-gray-400 text-sm">{profile.email}</p>
              </>
            )}
          </div>
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Resume / CV</h3>
            <div className="flex items-center p-3 bg-dark-900 rounded-lg border border-dark-700 mb-4">
              <FileTextIcon className="w-6 h-6 text-brand-500 mr-3" />
              <div className="overflow-hidden">
                <p className="text-white text-sm truncate">resume_2024.pdf</p>
                <p className="text-xs text-gray-500">Added Oct 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Skills, Experience */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 relative">
             {isEditing && formData.bio && formData.bio !== profile.bio && (
                 <span className="absolute top-2 right-2 text-xs text-green-400 flex items-center bg-green-900/30 px-2 py-1 rounded">
                   <SparklesIcon className="w-3 h-3 mr-1" /> AI Updated
                 </span>
             )}
            <h3 className="text-lg font-bold text-white mb-4">About Me</h3>
            {isEditing ? (
              <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg p-4 text-gray-300 focus:border-brand-500 focus:outline-none h-32"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Skills</h3>
            {isEditing ? (
              <div>
                <input 
                  type="text" 
                  value={formData.skills?.join(", ")}
                  onChange={e => setFormData({...formData, skills: e.target.value.split(",").map(s => s.trim())})}
                  className="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
                  placeholder="Comma separated skills (e.g. React, Design)"
                />
                <p className="text-xs text-gray-500 mt-2">Separate skills with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-dark-700 text-brand-300 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Experience</h3>
            <div className="space-y-4">
              {formData.experience?.map((exp, i) => (
                <div key={i} className="flex items-start justify-between border-b border-dark-700 pb-4 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-white">{exp.role}</h4>
                    <p className="text-gray-400 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-dark-900 px-2 py-1 rounded">{exp.duration}</span>
                </div>
              ))}
              {(!formData.experience || formData.experience.length === 0) && <p className="text-gray-500 text-sm">No experience listed.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileView;
