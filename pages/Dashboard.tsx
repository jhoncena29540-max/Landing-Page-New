import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { generateLandingPageHtml } from '../services/geminiService';
import { createLandingPage, getUserLandingPages } from '../services/firebaseService';
import { LandingPage, ToastMessage } from '../types';

interface DashboardProps {
  user: any;
  onToast: (msg: ToastMessage) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onToast }) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);

  useEffect(() => {
    if (user) {
      loadPages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadPages = async () => {
    try {
      const userPages = await getUserLandingPages(user.uid);
      setPages(userPages);
    } catch (error) {
      console.error("Error loading pages:", error);
    } finally {
      setLoadingPages(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      // 1. Generate Content via Gemini
      const htmlContent = await generateLandingPageHtml(prompt);
      
      // 2. Save to Firestore
      const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
      const pageId = await createLandingPage(user.uid, title, prompt, htmlContent);
      
      onToast({ id: Date.now().toString(), type: 'success', message: 'Landing page generated successfully!' });
      
      // 3. Redirect to Editor
      navigate(`/editor/${pageId}`);
    } catch (error: any) {
      onToast({ id: Date.now().toString(), type: 'error', message: error.message });
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Generator Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What do you want to build?</h1>
          <p className="text-gray-500 mb-8">Describe your product or service, and AI will do the rest.</p>
          
          <form onSubmit={handleGenerate} className="max-w-3xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A landing page for a vegan meal prep delivery service"
                className="w-full pl-6 pr-32 py-5 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 text-lg shadow-sm transition outline-none"
                disabled={generating}
              />
              <button 
                type="submit" 
                disabled={generating || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-indigo-700 text-white px-6 rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                {generating ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Generating
                  </>
                ) : (
                  <>
                    Generate <i className="fa-solid fa-wand-magic-sparkles ml-2"></i>
                  </>
                )}
              </button>
            </div>
            {generating && (
              <p className="mt-4 text-sm text-gray-500 animate-pulse">
                <i className="fa-solid fa-brain mr-2 text-primary"></i>
                AI is thinking... this typically takes 10-15 seconds.
              </p>
            )}
          </form>
        </div>

        {/* Your Pages Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fa-solid fa-layer-group mr-2 text-gray-400"></i> Your Landing Pages
          </h2>

          {loadingPages ? (
            <div className="flex justify-center py-20">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl text-gray-300"></i>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <i className="fa-regular fa-folder-open text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No pages yet</h3>
              <p className="text-gray-500 mt-1">Generate your first landing page above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div key={page.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition group">
                  <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                     {/* Thumbnail placeholder */}
                     <i className="fa-solid fa-image text-4xl text-gray-300"></i>
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
                        <Link to={`/editor/${page.id}`} className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
                          Edit
                        </Link>
                        {page.isPublished && (
                          <a href={page.publicUrl} target="_blank" rel="noreferrer" className="bg-secondary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-600">
                            View
                          </a>
                        )}
                     </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 truncate pr-2">{page.title}</h3>
                      {page.isPublished ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Live</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">Draft</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">{page.prompt}</p>
                    <div className="text-xs text-gray-400 flex justify-between items-center border-t border-gray-100 pt-3">
                      <span>{new Date(page.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                      <Link to={`/editor/${page.id}`} className="text-primary hover:text-indigo-700 font-medium">
                        Open Editor &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;