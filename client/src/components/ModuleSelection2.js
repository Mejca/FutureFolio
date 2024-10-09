// client/src/pages/moduleSelection/ModuleSelection.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/search/SearchBar';
import DropArea from '../../components/DropArea';
import './ModuleSelection.module.css'; // Import the updated CSS file

const ModuleSelection = () => {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState({ option1: [], option2: [] });

  useEffect(() => {
    // Fetch modules from API or other source
    fetch('/api/modules')
      .then((response) => response.json())
      .then((data) => setModules(data))
      .catch((error) => console.error('Error fetching modules:', error));
  }, []);

  const handleAddModule = (option, module) => {
    setSelectedModules((prev) => ({
      ...prev,
      [option]: [...prev[option], module],
    }));
  };

  const handleModuleClick = (module) => {
    console.log('Module clicked:', module);
  };

  return (
    <div className="module-selection-container">
      <div className="search-filter-section">
        <SearchBar modules={modules} onModuleClick={handleModuleClick} />
      </div>
      <div className="module-display-section">
        <div className="option-area">
          <h2>Option 1 <span className="add-button">+</span></h2>
          <DropArea
            title="Option 1"
            modules={selectedModules.option1}
            onDrop={(module) => handleAddModule('option1', module)}
          />
        </div>
        <div className="option-area">
          <h2>Option 2 <span className="add-button">+</span></h2>
          <DropArea
            title="Option 2"
            modules={selectedModules.option2}
            onDrop={(module) => handleAddModule('option2', module)}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleSelection;
