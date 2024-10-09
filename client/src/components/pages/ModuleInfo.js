import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaThLarge, FaThList, FaThumbtack, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './ModuleInfo.module.css';

const ModuleInfo = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [pinnedModules, setPinnedModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [filters, setFilters] = useState({ year: '', credits: '', semester: '', keyword: '' });
  const [isLargeGrid, setIsLargeGrid] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/modules');
        const data = await response.json();
        setModules(data);
        setFilteredModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const filtered = modules.filter(module => 
      (filters.year ? module.year.toString() === filters.year : true) &&
      (filters.credits ? module.credits.toString() === filters.credits : true) &&
      (filters.semester ? module.taught.toLowerCase().includes(filters.semester.toLowerCase()) : true) &&
      (filters.keyword ? (
        module.moduleName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        module.description.toLowerCase().includes(filters.keyword.toLowerCase())
      ) : true)
    );
    setFilteredModules(filtered);
  }, [modules, filters]);

  const handlePinModule = (moduleId) => {
    setPinnedModules(prev => {
      const isPinned = prev.some(m => m._id === moduleId);
      if (isPinned) {
        return prev.filter(m => m._id !== moduleId);
      } else {
        const moduleToPin = modules.find(m => m._id === moduleId);
        return [...prev, moduleToPin];
      }
    });
  };

  const toggleExpandModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleRemoveModule = (moduleId) => {
    setFilteredModules(prev => prev.filter(m => m._id !== moduleId));
    setPinnedModules(prev => prev.filter(m => m._id !== moduleId));
  };

  const toggleGridSize = () => {
    setIsLargeGrid(!isLargeGrid);
  };

  return (
    <div className={`${styles.moduleInfoContainer} ${darkMode ? styles.darkMode : ''}`}>
      {/* ... (keep existing control panel) */}
      <div className={`${styles.moduleGrid} ${isLargeGrid ? styles.largeGrid : styles.smallGrid}`}>
        {filteredModules.map(module => (
          <div key={module._id} className={`${styles.moduleCard} ${pinnedModules.some(m => m._id === module._id) ? styles.pinnedModule : ''}`}>
            <FaThumbtack
              className={`${styles.pinIcon} ${pinnedModules.some(m => m._id === module._id) ? styles.pinned : ''}`}
              onClick={() => handlePinModule(module._id)}
            />
            <h3>{module.moduleName}</h3>
            <p>{module.moduleCode} - {module.credits} credits</p>
            <p>{module.descriptionShort}</p>
            <div className={styles.buttonContainer}>
              <button className={styles.removeButton} onClick={() => handleRemoveModule(module._id)}>Remove</button>
              <button className={styles.moreInfoButton} onClick={() => toggleExpandModule(module._id)}>
                {expandedModules[module._id] ? <FaChevronUp /> : <FaChevronDown />} More Info
              </button>
            </div>
            {expandedModules[module._id] && (
              <div className={styles.expandedInfo}>
                <p><strong>Long Description:</strong> {module.descriptionLong}</p>
                <p><strong>Learning Outcomes:</strong> {module.learningOutcomes}</p>
                {/* Add more detailed information here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleInfo;