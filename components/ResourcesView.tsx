import React, { useState } from 'react';
import { BookIcon, SparklesIcon, XIcon, ArrowLeftIcon } from './Icons';
import { ResourceArticle } from '../types';

const ARTICLES: ResourceArticle[] = [
  {
    id: 1,
    title: "Mastering the Technical Interview",
    category: "Interview Prep",
    readTime: "5 min read",
    author: "Sarah Tech Lead",
    date: "May 12, 2024",
    description: "Learn the STAR method and common algorithm patterns to ace your next technical interview.",
    content: `
      <h3 class="text-xl font-bold text-white mb-4">The STAR Method</h3>
      <p class="mb-4">When answering behavioral questions, structure is key. The STAR method stands for Situation, Task, Action, and Result.</p>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Situation:</strong> Set the scene and give the necessary details of your example.</li>
        <li><strong>Task:</strong> Describe what your responsibility was in that situation.</li>
        <li><strong>Action:</strong> Explain exactly what steps you took to address it.</li>
        <li><strong>Result:</strong> Share what outcomes your actions achieved.</li>
      </ul>
      <h3 class="text-xl font-bold text-white mb-4 mt-8">Technical Patterns</h3>
      <p>Don't memorize code; memorize patterns. Sliding Window, Two Pointers, and Depth-First Search cover 70% of junior interview questions.</p>
    `
  },
  {
    id: 2,
    title: "Resume Tips for 2024",
    category: "Career Advice",
    readTime: "3 min read",
    author: "Recruiting Team",
    date: "April 05, 2024",
    description: "How to beat the ATS (Applicant Tracking Systems) and get your resume in front of real humans.",
    content: `
      <p class="mb-4">Modern recruiting relies heavily on automated systems. Here is how to optimize your CV:</p>
      <h4 class="font-bold text-white mb-2">1. Keywords Matter</h4>
      <p class="mb-4">Scan the job description. If they ask for "React" and "TypeScript", ensure those exact words appear in your skills section.</p>
      <h4 class="font-bold text-white mb-2">2. Keep it Simple</h4>
      <p class="mb-4">Fancy columns and graphics often confuse parsing bots. A single-column layout is safest.</p>
      <h4 class="font-bold text-white mb-2">3. Quantify Impact</h4>
      <p>Instead of "Fixed bugs", say "Reduced load time by 40% by optimizing database queries".</p>
    `
  },
  {
    id: 3,
    title: "Negotiating Your First Offer",
    category: "Salary",
    readTime: "7 min read",
    author: "Career Coach",
    date: "June 01, 2024",
    description: "Don't leave money on the table. A step-by-step guide to professional negotiation.",
    content: "<p>Negotiation is expected. Always express gratitude first, then ask if there is flexibility in the base salary or sign-on bonus.</p>"
  },
  {
    id: 4,
    title: "Building a Portfolio without Experience",
    category: "Portfolio",
    readTime: "4 min read",
    author: "Design Lead",
    date: "March 20, 2024",
    description: "Creative ways to showcase your skills through side projects and open source contributions.",
    content: "<p>You don't need a job to have experience. Contribute to Open Source, redesign a popular app, or build a tool that solves a personal problem.</p>"
  },
  {
    id: 5,
    title: "The Future of Remote Work",
    category: "Industry Trends",
    readTime: "6 min read",
    author: "Tech Blogger",
    date: "Feb 15, 2024",
    description: "Understanding asynchronous communication and how to thrive in a distributed team.",
    content: "<p>Remote work requires over-communication. Write documentation, update tickets, and be proactive in Slack.</p>"
  }
];

const ResourcesView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Article Modal */}
      {selectedArticle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                      <div className="flex items-center space-x-3">
                         <span className="px-2 py-1 bg-brand-900/30 text-brand-300 text-xs font-bold uppercase rounded border border-brand-800/30">
                              {selectedArticle.category}
                          </span>
                          <span className="text-gray-500 text-sm">{selectedArticle.readTime}</span>
                      </div>
                      <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-white transition-colors">
                          <XIcon className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto p-8 custom-scrollbar">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedArticle.title}</h1>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8 pb-8 border-b border-dark-700">
                          <span>By {selectedArticle.author}</span>
                          <span>•</span>
                          <span>{selectedArticle.date}</span>
                      </div>
                      
                      <div 
                        className="prose prose-invert prose-lg max-w-none text-gray-300"
                        dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                      />
                  </div>

                  <div className="p-4 border-t border-dark-700 bg-dark-900/50 flex justify-end">
                      <button 
                        onClick={() => setSelectedArticle(null)}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-medium"
                      >
                          Done Reading
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <BookIcon className="w-8 h-8 mr-3 text-brand-400" />
            Career Resources
        </h1>
        <p className="text-gray-400">Curated guides to help you land your next opportunity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((res) => (
              <div 
                key={res.id} 
                onClick={() => setSelectedArticle(res)}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-brand-500/50 hover:bg-dark-700/30 transition-all cursor-pointer group flex flex-col h-full"
              >
                  <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-dark-900 text-brand-300 text-xs font-bold uppercase rounded border border-dark-700">
                          {res.category}
                      </span>
                      <span className="text-gray-500 text-xs">{res.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {res.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                      {res.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-dark-700 flex items-center text-sm font-medium text-brand-400 group-hover:text-brand-300">
                      Read Article <SparklesIcon className="w-3 h-3 ml-1" />
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ResourcesView;
