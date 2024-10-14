import React from 'react';
import styles from './Link.module.css';

const Link = ({ link, nodes, darkMode }) => {
  const sourceNode = nodes.find(node => node.id === link.source);
  const targetNode = nodes.find(node => node.id === link.target);

  if (!sourceNode || !targetNode) return null;

  return (
    <line
      x1={sourceNode.x + sourceNode.width / 2}
      y1={sourceNode.y + sourceNode.height / 2}
      x2={targetNode.x + targetNode.width / 2}
      y2={targetNode.y + targetNode.height / 2}
      stroke={link.color || (darkMode ? '#fff' : '#000')}
      strokeWidth="2"
      className={styles.link}
    />
  );
};

export default Link;
