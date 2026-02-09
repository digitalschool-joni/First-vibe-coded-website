import React, { useState, useEffect } from 'react';
import { Opportunity, SqlQueryResult, ViewState, User, OpportunityType, Category } from './types';
import { executeMockQuery, getAllOpportunities, completeOnboarding } from './services/mockDb';
import { interpretUserQuery } from './services/geminiService';
import OpportunityCard from './components/OpportunityCard';
import SqlTerminal from './components/SqlTerminal';
import Sidebar from './components/Sidebar';
import ProfileView from './components/ProfileView';
import ApplicationsView from './components/ApplicationsView';
import InboxView from './components/InboxView';
import ResourcesView from './components/ResourcesView';
import SettingsView from './components/SettingsView';
import OpportunityDetail from './components/OpportunityDetail';
import AdminDashboard from './components/AdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import Auth from './components/Auth';
import TourGuide from './components/TourGuide';
import { SearchIcon, SparklesIcon, FilterIcon, SettingsIcon } from './components/Icons';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Tour State
  const [showTour, setShowTour] = useState(false);

  // Search & Filter State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSql, setActiveSql] = useState<SqlQueryResult | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("Hi there! I'm your Opportunity Assistant. Tell me what you're interested in, like 'paid coding internships' or 'art workshops'.");
  
  // Manual Filters
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterRemote, setFilterRemote] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
     const data = await getAllOpportunities();
     setResults(data);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    
    // Route based on Role
    if (loggedInUser.role === 'admin') {
        setCurrentView('admin_dashboard');
    } else if (loggedInUser.role === 'company') {
        setCurrentView('company_dashboard');
    } else {
        setCurrentView('discover');
    }
    
    // Trigger Tour if new seeker
    if (!loggedInUser.hasSeenOnboarding && loggedInUser.role === 'seeker') {
        setTimeout(() => setShowTour(true), 500); 
    }
  };

  const handleTourComplete = async () => {
      setShowTour(false);
      if (user) {
          await completeOnboarding(user.id);
          // Update local user state so tour doesn't show again in this session logic if we re-check
          setUser({ ...user, hasSeenOnboarding: true });
      }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
    setQuery('');
    setAiMessage("Hi there! I'm your Opportunity Assistant.");
    setActiveSql(null);
    setShowTour(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    
    setLoading(true);
    setAiMessage("Thinking...");
    setActiveSql(null);

    try {
      let interpretation = {
          sql: "",
          filters: {} as any,
          explanation: ""
      };

      if (query.trim()) {
          // 1. Interpret with Gemini only if there is text
          interpretation = await interpretUserQuery(query);
          setAiMessage(interpretation.explanation);
      } else {
          // No text query, just looking at filters
          setAiMessage("Filtering opportunities based on your selection.");
          interpretation.sql = "SELECT * FROM opportunities WHERE ..."; // Placeholder
      }

      // 2. Merge Manual Filters with AI Filters
      // Manual filters take precedence if set
      const mergedFilters = {
          ...interpretation.filters,
          type: filterType || interpretation.filters.type,
          category: filterCategory || interpretation.filters.category,
          is_remote: filterRemote ? true : (interpretation.filters.is_remote),
      };

      // 3. Execute against Mock DB
      const startTime = performance.now();
      const dbResults = await executeMockQuery(interpretation.sql, mergedFilters);
      const endTime = performance.now();

      // 4. Update State
      setResults(dbResults);
      setActiveSql({
        query: interpretation.sql,
        results: dbResults,
        executionTimeMs: Math.round(endTime - startTime)
      });

    } catch (err) {
      console.error(err);
      setAiMessage("Sorry, I had trouble connecting to the opportunities database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityClick = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  // View Router
  const renderContent = () => {
    if (!user) return <Auth onLogin={handleLogin} />;

    switch (currentView) {
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      
      case 'admin_dashboard':
        return user.role === 'admin' 
          ? <AdminDashboard refreshTrigger={fetchOpportunities} /> 
          : <div className="text-red-500">Access Denied</div>;

      case 'company_dashboard':
          return user.role === 'company'
            ? <CompanyDashboard user={user} />
            : <div className="text-red-500">Access Denied</div>;

      case 'profile':
        return <ProfileView userId={user.id} />;
      
      case 'applications':
        return <ApplicationsView userId={user.id} />;

      case 'inbox':
        return <InboxView userId={user.id} />;
      
      case 'resources':
        return <ResourcesView />;

      case 'settings':
        return <SettingsView user={user} />;
      
      case 'detail':
        return selectedOpportunity ? (
          <OpportunityDetail 
            data={selectedOpportunity} 
            userId={user.id}
            onBack={() => setCurrentView('discover')} 
            onNavigate={setCurrentView}
          />
        ) : (
          <div className="text-center text-gray-500">No opportunity selected</div>
        );
      
      case 'discover':
      default:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Find your path. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500">
                  Unlock your future.
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Access curated scholarships, internships, and workshops. Just ask our AI to query the database for you.
              </p>
            </div>

            {/* Search Bar Area */}
            <div id="search-container" className="bg-dark-800/50 backdrop-blur-xl border border-dark-700 p-4 rounded-2xl shadow-2xl relative space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: Show me paid tech internships in New York..."
                  className="w-full bg-dark-900 text-white placeholder-gray-500 px-6 py-4 pr-16 text-lg focus:outline-none rounded-xl border border-dark-700 focus:border-brand-500 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SearchIcon className="w-5 h-5" />
                  )}
                </button>
              </form>

              {/* Manual Filter Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dark-700/50">
                  <div className="flex items-center text-gray-400 text-sm mr-2">
                      <FilterIcon className="w-4 h-4 mr-1" />
                      Filters:
                  </div>
                  
                  <select 
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="bg-dark-900 border border-dark-700 text-gray-300 text-sm rounded-lg p-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  >
                      <option value="">Any Type</option>
                      {Object.values(OpportunityType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>

                  <select 
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="bg-dark-900 border border-dark-700 text-gray-300 text-sm rounded-lg p-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  >
                      <option value="">Any Category</option>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer bg-dark-900 border border-dark-700 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={filterRemote}
                        onChange={e => setFilterRemote(e.target.checked)}
                        className="rounded border-gray-600 text-brand-600 focus:ring-brand-500 bg-gray-700"
                      />
                      <span>Remote Only</span>
                  </label>
                  
                  {(filterType || filterCategory || filterRemote) && (
                      <button 
                        onClick={() => { setFilterType(''); setFilterCategory(''); setFilterRemote(false); }}
                        className="text-xs text-red-400 hover:text-red-300 ml-auto"
                      >
                          Reset Filters
                      </button>
                  )}
              </div>
            </div>

            {/* AI Feedback & SQL Terminal */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-900/50 p-3 rounded-full hidden md:block">
                  <SparklesIcon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1 bg-dark-800 rounded-xl p-5 border border-dark-700 relative">
                    {/* Triangle pointer */}
                    <div className="absolute top-6 -left-2 w-4 h-4 bg-dark-800 border-l border-b border-dark-700 transform rotate-45 hidden md:block"></div>
                    
                    <p className="text-brand-100">{aiMessage}</p>
                    
                    {/* The visible SQL connection */}
                    <div id="sql-terminal">
                        <SqlTerminal query={activeSql?.query || null} latency={activeSql?.executionTimeMs} />
                    </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  Opportunities <span className="ml-2 text-sm font-normal text-gray-500 bg-dark-800 px-2 py-0.5 rounded-full">{results.length}</span>
                </h3>
              </div>
              
              {results.length === 0 ? (
                <div className="text-center py-20 bg-dark-800/30 rounded-2xl border border-dashed border-dark-700">
                  <p className="text-gray-500">No opportunities found matching your criteria.</p>
                  <button onClick={() => { setQuery(''); setFilterType(''); setFilterCategory(''); setFilterRemote(false); fetchOpportunities(); }} className="mt-4 text-brand-400 hover:text-brand-300 underline">
                    Clear filters and view all
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((opp) => (
                    <OpportunityCard key={opp.id} data={opp} onClick={handleOpportunityClick} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col md:flex-row font-sans selection:bg-brand-500 selection:text-white">
      {user && (
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          user={user}
          onLogout={handleLogout}
        />
      )}
      
      {/* Onboarding Tour */}
      <TourGuide run={showTour} onComplete={handleTourComplete} />

      {/* Main Content */}
      <main className={`flex-1 ${user ? 'md:ml-64 p-4 md:p-8' : ''}`}>
        
        {/* Mobile Header (Only if logged in) */}
        {user && (
          <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2" onClick={() => setCurrentView('discover')}>
              <div className="bg-brand-600 p-1.5 rounded-lg">
                 <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">OppBridge</h1>
            </div>
          </div>
        )}

        {renderContent()}

      </main>
    </div>
  );
};

export default App;
