import React from 'react';
import styles from './ModuleList.module.css';

const ModuleList = ({ modules, onInfoClick, onAddModule }) => {
  if (!modules || modules.length === 0) {
    return <div>No modules available</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.moduleTable}>
        <thead>
          <tr>
            <th></th>
            <th>Module Name</th>
            <th>Module Code</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module._id}>
              <td>
                <div className={styles.dragHandle}>::</div>
              </td>
              <td>{module.moduleName}</td>
              <td>{module.moduleCode}</td>
              <td>{module.credits}</td>
              <td>
                <button onClick={() => onInfoClick(module)}>i</button>
                <button onClick={() => onAddModule('option1', module)}>Add to Option 1</button>
                <button onClick={() => onAddModule('option2', module)}>Add to Option 2</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleList;