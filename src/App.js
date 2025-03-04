import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase/config';
import SignIn from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import WorkshopApplication from './pages/Application';
import HomePage from './pages/Home';
import Society from './pages/Society';
const ProtectedRoute = ({ element }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);

      if (user?.email === "ieee@sahrdaya.ac.in") {
        navigate('/society', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? element : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/application" element={<ProtectedRoute element={<WorkshopApplication />} />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/society" element={<ProtectedRoute element={<Society />} />} />

      </Routes>
    </Router>
  );
};

export default App;
