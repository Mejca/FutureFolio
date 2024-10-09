import React from 'react';
import styles from './ModuleInfoCard.module.css';

const ModuleInfoCard = ({ module, onRemove }) => {
  return (
    <div className={styles.moduleInfoCard}>
      <button className={styles.removeButton} onClick={() => onRemove(module.moduleCode)}>×</button>
      <h2>{module.moduleName}</h2>
      <p><strong>Code:</strong> {module.moduleCode}</p>
      <p><strong>Credits:</strong> {module.credits}</p>
      <p><strong>Taught:</strong> {module.taught}</p>
      <p><strong>Description:</strong> {module.descriptionLong}</p>
      <p><strong>Learning Outcomes:</strong></p>
      <ul>
        {module.learningOutcomes.map((outcome, index) => (
          <li key={index}>{outcome}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleInfoCard;