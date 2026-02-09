import React, { useState, useEffect } from 'react';
import { XIcon, ArrowLeftIcon, SparklesIcon } from './Icons';

interface Step {
  title: string;
  content: string;
  targetId?: string; // ID of the element to highlight
  position: 'center' | 'left' | 'right' | 'bottom';
}

interface Props {
  onComplete: () => void;
  run: boolean;
}

const STEPS: Step[] = [
  {
    title: "Welcome to OppBridge!",
    content: "Let's take a quick tour to help you get started finding your dream opportunity.",
    position: 'center'
  },
  {
    title: "Smart Navigation",
    content: "Use the sidebar to navigate between finding jobs, tracking your applications, checking your inbox, and managing your profile.",
    targetId: 'sidebar-container',
    position: 'right'
  },
  {
    title: "AI-Powered Search",
    content: "Type anything here! 'Paid internships in remote tech', 'Art workshops', etc. Our AI translates your words into database queries.",
    targetId: 'search-container',
    position: 'bottom'
  },
  {
    title: "Import Your Resume",
    content: "Head to your Profile later to use our AI Resume Parser. It automatically fills your skills and experience!",
    targetId: 'nav-profile',
    position: 'right'
  },
  {
    title: "You're All Set!",
    content: "Go ahead and start exploring. Good luck!",
    position: 'center'
  }
];

const TourGuide: React.FC<Props> = ({ onComplete, run }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [style, setStyle] = useState<React.CSSProperties>({});
  
  useEffect(() => {
    if (!run) return;
    
    const updatePosition = () => {
        const step = STEPS[currentStep];
        if (step.position === 'center' || !step.targetId) {
            setStyle({
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            });
            return;
        }

        const el = document.getElementById(step.targetId);
        if (el) {
            const rect = el.getBoundingClientRect();
            // Simple positioning logic
            if (step.position === 'right') {
                setStyle({
                    top: rect.top + 20,
                    left: rect.right + 20,
                    position: 'fixed'
                });
            } else if (step.position === 'bottom') {
                setStyle({
                    top: rect.bottom + 20,
                    left: rect.left + (rect.width / 2) - 150, // Center roughly
                    position: 'fixed'
                });
            }
        }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, run]);

  if (!run) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
      onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
       {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto transition-opacity duration-500"></div>

      {/* Highlighter for target element (Optional visual polish) */}
      {STEPS[currentStep].targetId && (
         (() => {
             const el = document.getElementById(STEPS[currentStep].targetId!);
             if(!el) return null;
             const rect = el.getBoundingClientRect();
             return (
                 <div 
                   className="absolute border-2 border-brand-400 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300"
                   style={{
                       top: rect.top - 5,
                       left: rect.left - 5,
                       width: rect.width + 10,
                       height: rect.height + 10,
                   }}
                 />
             );
         })()
      )}

      {/* Step Card */}
      <div 
        style={style} 
        className="pointer-events-auto bg-dark-800 border border-dark-700 p-6 rounded-xl shadow-2xl w-[90%] max-w-sm z-50 animate-in fade-in zoom-in-95 duration-300"
      >
         <div className="flex justify-between items-start mb-4">
             <div className="bg-brand-900/50 p-2 rounded-lg">
                 <SparklesIcon className="w-6 h-6 text-brand-400" />
             </div>
             <button onClick={handleSkip} className="text-gray-500 hover:text-white">
                 <XIcon className="w-5 h-5" />
             </button>
         </div>
         
         <h3 className="text-xl font-bold text-white mb-2">{STEPS[currentStep].title}</h3>
         <p className="text-gray-400 mb-6 leading-relaxed text-sm">
             {STEPS[currentStep].content}
         </p>

         <div className="flex items-center justify-between">
             <div className="flex space-x-1">
                 {STEPS.map((_, i) => (
                     <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-brand-500' : 'w-1.5 bg-dark-600'}`}></div>
                 ))}
             </div>
             <button 
               onClick={handleNext}
               className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors"
             >
                 {currentStep === STEPS.length - 1 ? "Finish" : "Next"}
             </button>
         </div>
      </div>
    </div>
  );
};

export default TourGuide;
