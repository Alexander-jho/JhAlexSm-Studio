
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './lib/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';
import LandingPage from './components/LandingPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import Editor from './components/Editor/Editor.tsx';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(loading => {
        if(loading) return false;
        return loading;
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-[0_0_30px_-5px_darkblue]"></div>
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase">Initializing Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid #27272a'
        }
      }} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/editor/:id" element={user ? <Editor /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
