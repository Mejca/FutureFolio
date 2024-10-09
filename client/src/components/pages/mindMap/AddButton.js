// AddButton.js
import React from 'react';
import styles from './AddButton.module.css';

const AddButton = ({ position, onClick }) => {
  // Add a default position if it's not provided
  const { x = 0, y = 0 } = position || {};

  return (
    <g
      className={styles.addButton}
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
    >
      <circle r="10" fill="#4CAF50" />
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="16"
      >
        +
      </text>
    </g>
  );
};

export default AddButton;