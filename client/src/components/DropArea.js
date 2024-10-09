import React from 'react';
import styles from './DropArea.module.css';

const DropArea = ({ modules, onRemoveModule, onExpandModule, expandedModule }) => {
  return (
    <div className={styles.dropArea}>
      {modules.map(module => (
        <div key={module._id} className={styles.moduleCard}>
          <h3>{module.moduleName}</h3>
          <p>{module.credits} credits</p>
          <button onClick={() => onRemoveModule(module._id)}>Remove</button>
          <button onClick={() => onExpandModule(module._id)}>
            {expandedModule === module._id ? 'Less Info' : 'More Info'}
          </button>
          {expandedModule === module._id && (
            <div className={styles.expandedInfo}>
              <p><strong>Description:</strong> {module.description}</p>
              <p><strong>Learning Outcomes:</strong> {module.learningOutcomes.join(', ')}</p>
              <p><strong>Prerequisites:</strong> {module.prerequisites.join(', ') || 'None'}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropArea;