import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import styles from './ModuleInfo.module.css';
import AdvancedFilter from './AdvancedFilter';
import PinnedModules from './PinnedModules';

const ModuleInfo = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [pinnedModules, setPinnedModules] = useState([]);
  const { user } = useContext(UserContext);

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

  const handleFilter = (filters) => {
    const filtered = modules.filter(module => {
      return (
        (!filters.year || module.level === filters.year) &&
        (!filters.semester || module.taught.toLowerCase().includes(filters.semester)) &&
        (!filters.credits || module.credits === filters.credits) &&
        (!filters.search || 
          module.moduleName.toLowerCase().includes(filters.search.toLowerCase()) ||
          module.descriptionShort.toLowerCase().includes(filters.search.toLowerCase()) ||
          module.descriptionLong.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    });
    setFilteredModules(filtered);
  };

  const handlePin = (module) => {
    setPinnedModules(prev => [...prev, module]);
  };

  const handleUnpin = (moduleId) => {
    setPinnedModules(prev => prev.filter(m => m._id !== moduleId));
  };

  return (
    <div className={styles.moduleInfoContainer}>
      <h1>Module Information</h1>
      <AdvancedFilter onFilter={handleFilter} />
      <PinnedModules modules={pinnedModules} onUnpin={handleUnpin} />
      <div className={styles.moduleGrid}>
        {filteredModules.map(module => (
          <div key={module._id} className={styles.moduleCard}>
            <h2>{module.moduleName}</h2>
            <p><strong>Code:</strong> {module.moduleCode}</p>
            <p><strong>Credits:</strong> {module.credits}</p>
            <p><strong>Description:</strong> {module.descriptionShort}</p>
            <button onClick={() => handlePin(module)}>Pin</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleInfo;