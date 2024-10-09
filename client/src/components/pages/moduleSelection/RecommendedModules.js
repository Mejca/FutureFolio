import React from 'react';
import ModuleCard from '../../ModuleCard';
import styles from './RecommendedModules.module.css';

const RecommendedModules = ({ selectedModules, allModules, onAddModule }) => {
  const getRecommendedModules = () => {
    const selectedModuleCodes = new Set([
      ...selectedModules.option1.map(m => m.moduleCode),
      ...selectedModules.option2.map(m => m.moduleCode)
    ]);

    // Simple recommendation logic: recommend modules with similar credits
    const averageCredits = [...selectedModules.option1, ...selectedModules.option2].reduce((sum, module) => sum + module.credits, 0) / selectedModuleCodes.size || 10;

    return allModules
      .filter(module => !selectedModuleCodes.has(module.moduleCode))
      .filter(module => Math.abs(module.credits - averageCredits) <= 5)
      .slice(0, 5); // Recommend up to 5 modules
  };

  const recommendedModules = getRecommendedModules();

  return (
    <div className={styles.recommendedModules}>
      <h2>Recommended Modules</h2>
      {recommendedModules.map(module => (
        <ModuleCard
          key={module.moduleCode}
          module={module}
          onAddModule={() => onAddModule('option1', module)} // You might want to let the user choose which option to add to
        />
      ))}
    </div>
  );
};

export default RecommendedModules;