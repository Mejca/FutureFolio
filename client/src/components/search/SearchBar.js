import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ modules, onInfoClick, onAddModule, selectedModules, optionTitles, customFilter, isModuleInfo }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ year: '', credits: 'All', semester: 'All' });

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const defaultFilter = (module) => {
    const matchesQuery = module.moduleName?.toLowerCase().includes(query.toLowerCase());
    const matchesYear = filters.year ? module.academicYear?.toString() === filters.year : true;
    const matchesCredits = filters.credits === 'All' ? true : module.credits === parseInt(filters.credits);
    const matchesSemester = filters.semester === 'All' ? true : module.taught?.toLowerCase().includes(filters.semester.toLowerCase());

    return matchesQuery && matchesYear && matchesCredits && matchesSemester;
  };

  const filteredModules = modules.filter(customFilter || defaultFilter);

  return (
    <div className={styles.searchFilterSection}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a module..."
        className={styles.searchInput}
      />
      <div className={styles.filterInput}>
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
        >
          <option value="">All Years</option>
          {[...Array(6)].map((_, i) => {
            const year = 2020 + i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
        <div className={styles.creditButtons}>
          <button
            className={filters.credits === '10' ? styles.active : ''}
            onClick={() => handleFilterChange({ target: { name: 'credits', value: '10' } })}
          >
            10
          </button>
          <button
            className={filters.credits === '20' ? styles.active : ''}
            onClick={() => handleFilterChange({ target: { name: 'credits', value: '20' } })}
          >
            20
          </button>
          <button
            className={filters.credits === 'All' ? styles.active : ''}
            onClick={() => handleFilterChange({ target: { name: 'credits', value: 'All' } })}
          >
            All
          </button>
        </div>
        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
        >
          <option value="All">All Semesters</option>
          <option value="Autumn">Autumn</option>
          <option value="Spring">Spring</option>
        </select>
      </div>
      {isModuleInfo ? (
        <div className={styles.moduleGrid}>
          {filteredModules.map((module) => (
            <div key={module.moduleCode} className={styles.moduleCard}>
              <h3>{module.moduleName}</h3>
              <p>{module.moduleCode} - {module.credits} credits</p>
              <p>{module.descriptionShort}</p>
              <button onClick={() => onInfoClick(module)}>More Info</button>
            </div>
          ))}
        </div>
      ) : (
        <table className={styles.moduleTable}>
          <thead>
            <tr>
              <th></th>
              <th><span>Module Name</span></th>
              <th><span>Module Code</span></th>
              <th><span>Credits</span></th>
              <th><span>{optionTitles.option1}</span></th>
              <th><span>{optionTitles.option2}</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module) => (
              <tr key={module.moduleCode}>
                <td><button className={styles.infoButton} onClick={() => onInfoClick(module)}>i</button></td>
                <td>{module.moduleName}</td>
                <td>{module.moduleCode}</td>
                <td>{module.credits}</td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedModules.option1.some(m => m.moduleCode === module.moduleCode)}
                    onChange={() => onAddModule('option1', module)}
                  />
                </td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedModules.option2.some(m => m.moduleCode === module.moduleCode)}
                    onChange={() => onAddModule('option2', module)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchBar;