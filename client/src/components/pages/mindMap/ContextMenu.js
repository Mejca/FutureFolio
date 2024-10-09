import React from 'react';
import styles from './ContextMenu.module.css';

const ContextMenu = ({ x, y, menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <div className={styles.contextMenu} style={{ left: x, top: y }}>
      {menuItems.map((item, index) => (
        <button key={index} onClick={item.onClick}>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;