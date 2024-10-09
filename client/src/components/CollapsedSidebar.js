import React from 'react';
import { FaSearch, FaFilter, FaExpand } from 'react-icons/fa';
import styles from './CollapsedSidebar.module.css';

const CollapsedSidebar = ({ onExpand, onSearch, onFilter }) => {
  return (
    <div className={styles.collapsedSidebar}>
      <button onClick={onSearch} title="Search">
        <FaSearch />
      </button>
      <button onClick={onFilter} title="Filter">
        <FaFilter />
      </button>
      <button onClick={onExpand} title="Expand Sidebar">
        <FaExpand />
      </button>
    </div>
  );
};

export default CollapsedSidebar;