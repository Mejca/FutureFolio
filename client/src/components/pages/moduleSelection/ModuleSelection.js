// src/components/pages/moduleSelection/ModuleSelection.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaSearch, FaFilter, FaEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SearchBar from '../../search/SearchBar';
import DropArea from '../../DropArea';
import ModuleInfoModal from './ModuleInfoModal';
import styles from '../../pages/moduleSelection/ModuleSelection.module.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

const ModuleSelection = () => {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState({ option1: [], option2: [] });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [creditTotals, setCreditTotals] = useState({
    option1: { autumn: 0, spring: 0 },
    option2: { autumn: 0, spring: 0 }
  });
  const [optionTitles, setOptionTitles] = useState({ option1: 'Selection 1', option2: 'Selection 2' });
  const [editingTitle, setEditingTitle] = useState(null);
  const [notification, setNotification] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const CREDIT_REQUIREMENT = 120;

  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/modules');
        const data = await response.json();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  const updateCredits = (option, modules) => {
    const credits = modules.reduce((acc, module) => {
      if (module.taught?.toLowerCase().includes('full year')) {
        acc.autumn += module.credits / 2;
        acc.spring += module.credits / 2;
      } else {
        const semester = module.taught?.toLowerCase().includes('autumn') ? 'autumn' : 'spring';
        acc[semester] += module.credits;
      }
      return acc;
    }, { autumn: 0, spring: 0 });

    setCreditTotals(prev => ({
      ...prev,
      [option]: credits
    }));
  };

  const handleAddModule = (option, module) => {
    setSelectedModules((prev) => {
      const isModuleSelected = prev[option].some((m) => m.moduleCode === module.moduleCode);
      
      if (isModuleSelected) {
        const updatedModules = {
          ...prev,
          [option]: prev[option].filter((m) => m.moduleCode !== module.moduleCode),
        };
        updateCredits(option, updatedModules[option]);
        showNotification(`Module ${module.moduleCode} removed from ${optionTitles[option]}`);
        return updatedModules;
      } else {
        const semester = module.taught.toLowerCase().includes('autumn') ? 'autumn' : 
                         module.taught.toLowerCase().includes('spring') ? 'spring' : 'full year';
        const updatedModules = {
          ...prev,
          [option]: [...prev[option], { ...module, semester }],
        };
        updateCredits(option, updatedModules[option]);
        showNotification(`Module ${module.moduleCode} added to ${optionTitles[option]}`);
        return updatedModules;
      }
    });
  };

  const handleRemoveModule = (option, module) => {
    setSelectedModules((prev) => {
      const updatedModules = {
        ...prev,
        [option]: prev[option].filter(m => m.moduleCode !== module.moduleCode),
      };
      updateCredits(option, updatedModules[option]);
      showNotification(`Module ${module.moduleCode} removed from ${optionTitles[option]}`);
      return updatedModules;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const calculateProgress = (option) => {
    const totalCredits = creditTotals[option].autumn + creditTotals[option].spring;
    return (totalCredits / CREDIT_REQUIREMENT) * 100;
  };

  const handleTitleEdit = (option) => {
    setEditingTitle(option);
  };

  const handleTitleSave = (option, newTitle) => {
    setOptionTitles(prev => ({ ...prev, [option]: newTitle }));
    setEditingTitle(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleClearAll = (option) => {
    setSelectedModules(prev => ({
      ...prev,
      [option]: []
    }));
    updateCredits(option, []);
    showNotification(`Cleared all modules from ${optionTitles[option]}`);
  };

  const toggleExpandModule = (moduleCode) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleCode]: !prev[moduleCode]
    }));
  };

  return (
    <div className={`${styles.moduleSelectionContainer} ${darkMode ? styles.darkMode : ''}`}>
      <div className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        {!isSidebarCollapsed && (
          <SearchBar
            modules={modules}
            onInfoClick={toggleExpandModule}
            onAddModule={handleAddModule}
            selectedModules={selectedModules}
            optionTitles={optionTitles}
          />
        )}
      </div>
      <div className={styles.moduleDisplaySection}>
        <div className={styles.optionsContainer}>
          {['option1', 'option2'].map((option) => (
            <div key={option} className={styles.optionArea}>
              <div className={styles.optionHeader}>
                {editingTitle === option ? (
                  <input
                    type="text"
                    value={optionTitles[option]}
                    onChange={(e) => setOptionTitles(prev => ({ ...prev, [option]: e.target.value }))}
                    onBlur={() => handleTitleSave(option, optionTitles[option])}
                    autoFocus
                  />
                ) : (
                  <h2>
                    {optionTitles[option]}
                    <button onClick={() => handleTitleEdit(option)} className={styles.editTitleButton}>
                      <FaEdit />
                    </button>
                  </h2>
                )}
                <button 
                  className={styles.clearButton} 
                  onClick={() => handleClearAll(option)}
                >
                  Clear All
                </button>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{width: `${calculateProgress(option)}%`}}
                ></div>
              </div>
              <div className={styles.progressText}>
                Progress: {calculateProgress(option).toFixed(1)}% ({creditTotals[option].autumn + creditTotals[option].spring}/{CREDIT_REQUIREMENT} credits)
              </div>
              {['autumn', 'spring'].map((semester) => (
                <div key={semester} className={styles.semesterSection}>
                  <h3>{semester.charAt(0).toUpperCase() + semester.slice(1)}</h3>
                  <div className={styles.credits}>
                    Total Credits: {creditTotals[option][semester]}
                  </div>
                  <div className={styles.moduleList}>
                    {selectedModules[option]
                      .filter(m => m.taught?.toLowerCase().includes(semester) || m.taught?.toLowerCase().includes('full year'))
                      .map((module) => (
                        <div key={module.moduleCode} className={styles.moduleCard}>
                          <h3>{module.moduleName}</h3>
                          <p>{module.moduleCode} - {module.credits} credits</p>
                          <div className={styles.buttonGroup}>
                            <button
                              className={styles.removeButton}
                              onClick={() => handleRemoveModule(option, module)}
                            >
                              Remove
                            </button>
                            <button
                              className={styles.moreInfoButton}
                              onClick={() => toggleExpandModule(module.moduleCode)}
                            >
                              {expandedModules[module.moduleCode] ? (
                                <>Less Info <FaChevronUp /></>
                              ) : (
                                <>More Info <FaChevronDown /></>
                              )}
                            </button>
                          </div>
                          <AnimatePresence>
                            {expandedModules[module.moduleCode] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className={styles.expandedInfo}
                              >
                                <h4>Description:</h4>
                                <p>{module.descriptionLong}</p>
                                <h4>Learning Outcomes:</h4>
                                <ul>
                                  {module.learningOutcomes?.map((outcome, index) => (
                                    <li key={index}>{outcome}</li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {notification && (
          <motion.div
            className={styles.notification}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleSelection;