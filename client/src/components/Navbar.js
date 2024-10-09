// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext'; // Updated import path

const NavBar = () => {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useUser();

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.darkMode : ''}`}>
      <ul className={styles.navList}>
        <li>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/courses" className={location.pathname === '/courses' ? styles.active : ''}>
            Courses
          </Link>
        </li>
        <li>
          <Link to="/module-info" className={location.pathname === '/module-info' ? styles.active : ''}>
            Module Information
          </Link>
        </li>
        <li>
          <Link to="/module-selection" className={location.pathname === '/module-selection' ? styles.active : ''}>
            Module Selection Tool
          </Link>
        </li>
        <li>
          <Link to="/mind-map" className={location.pathname === '/mind-map' ? styles.active : ''}>
            Mind Map
          </Link>
        </li>
        <li>
          <Link to="/info" className={location.pathname === '/info' ? styles.active : ''}>
            Info
          </Link>
        </li>
      </ul>
      <div className={styles.userControls}>
        {user ? (
          <>
            <span className={styles.welcome}>Welcome, {user.username}!</span>
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <Link to="/login" className={styles.loginButton}>Login</Link>
        )}
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle dark mode">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;