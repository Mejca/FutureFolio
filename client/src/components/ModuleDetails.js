// client/src/components/ModuleDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const ModuleDetails = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      const result = await api.getModuleDetails(id);
      setModule(result);
    };
    fetchModuleDetails();
  }, [id]);

  if (!module) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{module.moduleName}</h2>
      <p>{module.descriptionLong}</p>
      <h3>Details</h3>
      <p><strong>Credits:</strong> {module.credits}</p>
      <p><strong>Convenor:</strong> {module.convenor}</p>
    </div>
  );
};

export default ModuleDetails;
