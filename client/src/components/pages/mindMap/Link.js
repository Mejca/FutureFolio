import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Link.module.css';

const Link = ({ link, nodes, darkMode }) => {
  const sourceNode = nodes.find(node => node.id === link.source);
  const targetNode = nodes.find(node => node.id === link.target);

  if (!sourceNode || !targetNode) return null;

  const sourceX = sourceNode.x + sourceNode.width / 2;
  const sourceY = sourceNode.y + sourceNode.height / 2;
  const targetX = targetNode.x + targetNode.width / 2;
  const targetY = targetNode.y + targetNode.height / 2;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const path = `M ${sourceX} ${sourceY} Q ${midX} ${midY} ${targetX} ${targetY}`;

  return (
    <path
      key={uuidv4()}
      d={path}
      className={`${styles.link} ${darkMode ? styles.darkMode : ''}`}
      fill="none"
      stroke={darkMode ? "#999" : "#666"}
      strokeWidth="2"
    />
  );
};

export default React.memo(Link);