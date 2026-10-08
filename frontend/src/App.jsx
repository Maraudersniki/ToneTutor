import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, AlertCircle, Loader2, ArrowRight, Sun, Moon } from 'lucide-react';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState('campus_communicator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formality, setFormality] = useState(3);
  const [length, setLength] = useState(3);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.trim()) {
      setError('Please enter a draft to polish.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch('http://localhost:8000/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft_text: draft,
          selected_mode: mode,
          formality: formality,
          length: length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to rewrite message');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.revised_text) {
      navigator.clipboard.writeText(result.revised_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!showApp) {
    return (
      <div className="min-h-screen bg-[#f3f2ee] text-zinc-800 dark:bg-[#0d0e15] dark:text-zinc-300 transition-colors duration-500 font-mono p-4 md:p-8">
        
        {/* Navbar / Header with Toggle Button */}
        <div className="max-w-4xl mx-auto p-4 flex justify-end">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <div className="mb-6">
              <span className="text-[10px] text-zinc-500 tracking-widest uppercase border border-zinc-300 dark:border-zinc-800 rounded px-2 py-0.5 inline-block mb-2">SYSTEM: ACTIVE</span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-[#ea580c] dark:text-[#38bdf8] uppercase">
                ToneTutor
              </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your AI-powered communication coach. Write professional messages with confidence and learn how to improve your tone.
            </p>
            <div className="bg-white/70 border border-zinc-300/80 rounded-xl p-5 md:p-6 mb-6 dark:bg-[#12131a] dark:border-zinc-800/90 relative group overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Master high-stakes emails</h2>
              <ul className="text-left space-y-3 mb-8 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Niche-specific rewriting (Students & Devs)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instant professional polish</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Actionable feedback explaining the "why"</span>
                </li>
              </ul>
              <button
                onClick={() => setShowApp(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#eae9e4] border border-zinc-400 hover:bg-[#e0dfd9] hover:border-[#ea580c] dark:bg-[#181921] dark:border-zinc-800 dark:hover:bg-[#1f212c] dark:hover:border-[#38bdf8] text-[#ea580c] dark:text-[#38bdf8] py-3.5 px-6 rounded-lg font-bold transition-all text-sm uppercase tracking-widest"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ee] text-zinc-800 dark:bg-[#0d0e15] dark:text-zinc-300 transition-colors duration-500 font-mono p-4 md:p-8">
      
      {/* Navbar / Header with Toggle Button */}
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-8">
        <button 
          onClick={() => setShowApp(false)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          &larr; Back home
        </button>
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-[10px] text-zinc-500 tracking-widest uppercase border border-zinc-300 dark:border-zinc-800 rounded px-2 py-0.5 inline-block mb-2">SYSTEM: ACTIVE</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-[#ea580c] dark:text-[#38bdf8] uppercase">ToneTutor</h1>
          </div>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Elevate your high-stakes professional messages.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 border border-zinc-300/80 rounded-xl p-5 md:p-6 mb-6 dark:bg-[#12131a] dark:border-zinc-800/90 relative group overflow-hidden">
          <div className="absolute top-2 left-2 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">+</div>
          <div className="absolute top-2 right-2 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">[ ]</div>
          <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" /> REWRITE_ENGINE // OK
          </div>
          <div className="p-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Niche Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-[#ebebeb]/50 text-zinc-900 border border-zinc-300 rounded-lg p-3.5 focus:outline-none focus:border-[#ea580c] dark:bg-black/50 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-[#38bdf8] focus:ring-1 focus:ring-opacity-40 transition-all font-mono text-xs md:text-sm mt-2"
                >
                  <option value="campus_communicator">Campus Communicator (Students ↔ Professors)</option>
                  <option value="recruiter_bridge">Recruiter Bridge (Developers ↔ Recruiters)</option>
                  <option value="peer_collaborator">Peer Collaborator (Misc)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Formality: {formality === 1 ? 'Very Casual' : formality === 2 ? 'Casual' : formality === 3 ? 'Balanced' : formality === 4 ? 'Formal' : 'Strict'}
                  </label>
                  <input 
                    type="range" min="1" max="5" value={formality} onChange={(e) => setFormality(parseInt(e.target.value))}
                    className="w-full accent-[#ea580c] dark:accent-[#38bdf8] h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Length: {length === 1 ? 'Bullet Points' : length === 2 ? 'Concise' : length === 3 ? 'Balanced' : length === 4 ? 'Detailed' : 'Extensive'}
                  </label>
                  <input 
                    type="range" min="1" max="5" value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full accent-[#ea580c] dark:accent-[#38bdf8] h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="draft" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rough Draft
                </label>
                <div className="mt-2">
                  <textarea
                    id="draft"
                    name="draft"
                    rows={6}
                    className="w-full bg-[#ebebeb]/50 text-zinc-900 border border-zinc-300 rounded-lg p-3.5 focus:outline-none focus:border-[#ea580c] dark:bg-black/50 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-[#38bdf8] focus:ring-1 focus:ring-opacity-40 transition-all font-mono text-xs md:text-sm"
                    placeholder="Paste your rough draft here..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#eae9e4] border border-zinc-400 hover:bg-[#e0dfd9] hover:border-[#ea580c] dark:bg-[#181921] dark:border-zinc-800 dark:hover:bg-[#1f212c] dark:hover:border-[#38bdf8] text-[#ea580c] dark:text-[#38bdf8] py-3.5 px-6 rounded-lg font-bold transition-all text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Polishing...</>
                  ) : (
                    'Polish Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        )}

        {/* Output Section */}
        {result && !loading && (
          <div className="space-y-6">
            
            {/* Card 1: Polished Draft */}
            <div className="bg-white/90 dark:bg-[#111219] border border-zinc-300 dark:border-zinc-800/80 rounded-lg p-5">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center transition-colors duration-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">The Polished Draft</h3>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  {copied ? (
                    <><CheckCircle className="h-4 w-4 mr-1 text-green-500 dark:text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1" /> Copy to Clipboard</>
                  )}
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {result.revised_text}
                </p>
              </div>
            </div>

            {/* Card 2: Coach's Feedback */}
            <div className="bg-white/90 dark:bg-[#111219] border border-zinc-300 dark:border-zinc-800/80 rounded-lg p-5">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/30 transition-colors duration-200">
                <h3 className="text-lg leading-6 font-medium text-indigo-900 dark:text-indigo-300 flex items-center">
                  <span className="mr-2">💡</span> Coach's Feedback
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {result.feedback_points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-zinc-200/50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 font-bold border border-zinc-300 dark:border-zinc-800 w-8 h-8 flex items-center justify-center rounded mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
