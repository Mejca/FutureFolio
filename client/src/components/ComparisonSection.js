// client/src/components/ComparisonSection.js
import React from 'react';

const ComparisonSection = ({ title, modules }) => {
  return (
    <div className="comparison-section">
      <h2>{title}</h2>
      <ul>
        {modules.map(module => (
          <li key={module._id}>{module.moduleName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ComparisonSection;
