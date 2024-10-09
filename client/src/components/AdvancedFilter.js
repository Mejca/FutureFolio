import React, { useState } from 'react';
import styles from './AdvancedFilter.module.css';

const AdvancedFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    credits: '',
    search: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.filterForm}>
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search modules..."
      />
      <select name="year" value={filters.year} onChange={handleChange}>
        <option value="">All Years</option>
        <option value="1">Year 1</option>
        <option value="2">Year 2</option>
        <option value="3">Year 3</option>
        <option value="4">Year 4</option>
      </select>
      <select name="semester" value={filters.semester} onChange={handleChange}>
        <option value="">All Semesters</option>
        <option value="autumn">Autumn</option>
        <option value="spring">Spring</option>
      </select>
      <select name="credits" value={filters.credits} onChange={handleChange}>
        <option value="">All Credits</option>
        <option value="10">10 Credits</option>
        <option value="20">20 Credits</option>
      </select>
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default AdvancedFilter;