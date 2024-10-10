import React from 'react';
import styles from './ContextMenuWheel.module.css';

const ContextMenuWheel = ({ x, y, nodeId, onAction }) => {
  const actions = [
    { name: 'arrange', label: 'Auto-arrange', icon: '⟲' },
    { name: 'style', label: 'Choose style', icon: '🎨' },
    { name: 'delete', label: 'Delete branch', icon: '🗑' },
    { name: 'copy', label: 'Copy branch', icon: '📋' },
    { name: 'transplant', label: 'Transplant', icon: '🌱' },
    { name: 'add', label: 'Add branch', icon: '+' },
    { name: 'shape', label: 'Choose shape', icon: '◇' },
  ];

  const radius = 80;
  const innerRadius = 30;
  const angleStep = (2 * Math.PI) / actions.length;

  return (
    <div 
      className={styles.contextMenuWrapper} 
      style={{ left: x - radius, top: y - radius }}
    >
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle cx={radius} cy={radius} r={radius} fill="#f0f0f0" />
        <circle cx={radius} cy={radius} r={innerRadius} fill="#ffffff" />
        {actions.map((action, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x1 = radius + innerRadius * Math.cos(angle);
          const y1 = radius + innerRadius * Math.sin(angle);
          const x2 = radius + radius * Math.cos(angle);
          const y2 = radius + radius * Math.sin(angle);

          return (
            <g key={action.name} onClick={() => onAction(action.name, nodeId)}>
              <path
                d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${radius + radius * Math.cos(angle + angleStep)} ${radius + radius * Math.sin(angle + angleStep)} L ${radius + innerRadius * Math.cos(angle + angleStep)} ${radius + innerRadius * Math.sin(angle + angleStep)}`}
                fill="#ffffff"
                stroke="#cccccc"
              />
              <text
                x={radius + (radius + innerRadius) / 2 * Math.cos(angle + angleStep / 2)}
                y={radius + (radius + innerRadius) / 2 * Math.sin(angle + angleStep / 2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
              >
                {action.icon}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ContextMenuWheel;