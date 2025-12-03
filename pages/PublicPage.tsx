import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLandingPageById } from '../services/firebaseService';
import { LandingPage } from '../types';

const PublicPage: React.FC = () => {
  // We need both userId and pageId to find the document in the subcollection
  const { userId, pageId } = useParams();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pageId && userId) {
      loadPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, userId]);

  const loadPage = async () => {
    try {
      if (!pageId || !userId) return;
      const data = await getLandingPageById(userId, pageId);
      
      // Only show if published
      if (data && data.isPublished) {
        setPage(data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <i className="fa-solid fa-circle-notch fa-spin text-4xl text-gray-300"></i>
    </div>
  );

  if (error || !page) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
        <i className="fa-solid fa-link-slash text-2xl"></i>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">This landing page does not exist or has not been published yet.</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Go to LandAI Home &rarr;</a>
    </div>
  );

  // Render raw HTML
  // We wrap in a div and use dangerouslySetInnerHTML
  // Since this content comes from our AI (trusted source contextually) and is purely static HTML/CSS
  return (
    <div dangerouslySetInnerHTML={{ __html: page.htmlContent }} />
  );
};

export default PublicPage;