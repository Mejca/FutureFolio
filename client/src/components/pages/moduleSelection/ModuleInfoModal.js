import React from 'react';
import Modal from 'react-modal';
import { useTheme } from '../../../contexts/ThemeContext';
import styles from './ModuleInfoModal.module.css';

const ModuleInfoModal = ({ isOpen, onRequestClose, module }) => {
  const { darkMode } = useTheme();

  if (!module) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Module Information"
      className={`${styles.modal} ${darkMode ? styles.darkMode : ''}`}
      overlayClassName={styles.overlay}
    >
      <h2>{module.moduleName}</h2>
      <p><strong>Code:</strong> {module.moduleCode}</p>
      <p><strong>Credits:</strong> {module.credits}</p>
      <p><strong>Description:</strong> {module.descriptionLong}</p>
      <p><strong>Learning Outcomes:</strong> {module.learningOutcomes.join(', ')}</p>
      <p><strong>Prerequisites:</strong> {module.prerequisites.join(', ') || 'None'}</p>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ModuleInfoModal;