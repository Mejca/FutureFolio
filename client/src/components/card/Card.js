// client/src/components/ModuleCard.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const ModuleCard = ({ module, onAddModule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: 'module',
    item: { ...module },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`border rounded p-4 mb-4 ${isDragging ? 'bg-gray-200' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">{module.moduleName}</h3>
          <p>{module.moduleCode}</p>
        </div>
        <div>
          <button className="mr-2" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Hide Info' : 'More Info'}
          </button>
          <button className="mr-2">Contact</button>
          <button onClick={() => onAddModule(module)}>Add</button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <p>Credits: {module.credits}</p>
          <p>Compulsory/Optional: {module.compulsory ? 'Compulsory' : 'Optional'}</p>
          <p>Assessment: {module.assessment}</p>
          <p>Instructor: {module.instructor}</p>
          <p>Prerequisites: {module.prerequisites}</p>
          <p>Learning Outcomes: {module.learningOutcomes}</p>
          <p>Teaching Period: {module.teachingPeriod}</p>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
