// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { MindMapProvider } from './components/pages/mindMap/MindMapContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CourseList from './components/CourseList';
import ModuleList from './components/ModuleList';
import CourseDetails from './components/CourseDetails';
import ModuleDetails from './components/ModuleDetails';
import ModuleSelection from './components/pages/moduleSelection/ModuleSelection';
import MindMap from './components/pages/mindMap/MindMap';
import ModuleInfo from './components/pages/ModuleInfo';
import Login from './components/Login';
import './darkMode.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setUserId('test1');
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (newUserId, newUsername) => {
    setUserId(newUserId);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserId(null);
    setUsername(null);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <MindMapProvider>
            <div className="App">
              <Navbar username={username} onLogout={handleLogout} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={
                  userId ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                } />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/modules" element={<ModuleList />} />
                <Route path="/modules/:id" element={<ModuleDetails />} />
                <Route path="/module-selection" element={<ModuleSelection />} />
                <Route path="/mind-map" element={<MindMap />} />
                <Route path="/module-info" element={<ModuleInfo />} />
              </Routes>
            </div>
          </MindMapProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
