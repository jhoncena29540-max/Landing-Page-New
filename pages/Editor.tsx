import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLandingPageById, publishLandingPage } from '../services/firebaseService';
import { LandingPage, ToastMessage } from '../types';

interface EditorProps {
  user: any;
  onToast: (msg: ToastMessage) => void;
}

const Editor: React.FC<EditorProps> = ({ user, onToast }) => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (pageId && user) {
      fetchPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, user]);

  const fetchPage = async () => {
    if (!pageId) return;
    try {
      const data = await getLandingPageById(pageId);
      if (data && data.ownerId === user.uid) {
        setPage(data);
      } else {
        onToast({ id: Date.now().toString(), type: 'error', message: 'Page not found or unauthorized' });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      onToast({ id: Date.now().toString(), type: 'error', message: 'Error loading page' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!page || !pageId) return;
    setPublishing(true);
    try {
      const url = await publishLandingPage(pageId, user.uid);
      setPage({ ...page, isPublished: true, publicUrl: url });
      onToast({ id: Date.now().toString(), type: 'success', message: 'Page published successfully!' });
    } catch (error) {
      onToast({ id: Date.now().toString(), type: 'error', message: 'Failed to publish page' });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-500">Loading editor...</p>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-500 hover:text-gray-900">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="font-bold text-gray-800 truncate max-w-xs">{page.title}</h1>
          <span className={`ml-3 px-2 py-0.5 text-xs rounded-full font-medium ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {page.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-md transition ${viewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <i className="fa-solid fa-desktop mr-2"></i> Desktop
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-md transition ${viewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <i className="fa-solid fa-mobile-screen mr-2"></i> Mobile
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {page.isPublished && (
             <a 
               href={page.publicUrl} 
               target="_blank" 
               rel="noreferrer"
               className="text-gray-600 hover:text-primary font-medium text-sm mr-2"
             >
               View Live <i className="fa-solid fa-external-link-alt ml-1"></i>
             </a>
          )}
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className="bg-primary hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition flex items-center shadow-sm disabled:opacity-70"
          >
            {publishing ? (
              <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Publishing</>
            ) : (
              <>{page.isPublished ? 'Update Site' : 'Publish Site'} <i className="fa-solid fa-cloud-arrow-up ml-2"></i></>
            )}
          </button>
        </div>
      </header>

      {/* Preview Area */}
      <main className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
        <div 
          className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden relative ${
            viewMode === 'mobile' ? 'w-[375px] h-[700px] rounded-3xl border-8 border-gray-800' : 'w-full h-full rounded-lg border border-gray-200'
          }`}
        >
            {/* 
              Safe Render:
              In a real app, use an iframe to isolate styles.
              Here we render strictly into a container. 
            */}
            <iframe
              title="preview"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                    <style>
                      ::-webkit-scrollbar { width: 8px; }
                      ::-webkit-scrollbar-track { background: #f1f1f1; }
                      ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
                      ::-webkit-scrollbar-thumb:hover { background: #555; }
                    </style>
                  </head>
                  <body>${page.htmlContent}</body>
                </html>
              `}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
        </div>
      </main>
    </div>
  );
};

export default Editor;