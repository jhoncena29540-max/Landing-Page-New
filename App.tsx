import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicPage from './pages/PublicPage';
import { Toast } from './components/Toast';
import { ToastMessage } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToast = (msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <i className="fa-solid fa-circle-notch fa-spin text-primary text-4xl"></i>
      </div>
    );
  }

  return (
    <Router>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast} onClose={removeToast} />
          ))}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        
        <Route 
          path="/login" 
          element={!user ? <Auth onToast={addToast} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Auth onToast={addToast} /> : <Navigate to="/dashboard" />} 
        />
        
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onToast={addToast} /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/editor/:pageId" 
          element={user ? <Editor user={user} onToast={addToast} /> : <Navigate to="/login" />} 
        />
        
        {/* Public Route - Accessible by anyone */}
        <Route path="/p/:userId/:pageId" element={<PublicPage />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;