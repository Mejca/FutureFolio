import React from 'react';
import styles from './PinnedModules.module.css';

const PinnedModules = ({ modules, onUnpin }) => {
  return (
    <div className={styles.pinnedModules}>
      <h2>Pinned Modules</h2>
      {modules.length === 0 ? (
        <p>No modules pinned yet.</p>
      ) : (
        <ul>
          {modules.map(module => (
            <li key={module._id} className={styles.pinnedModule}>
              <span>{module.moduleName}</span>
              <button onClick={() => onUnpin(module._id)}>Unpin</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PinnedModules;