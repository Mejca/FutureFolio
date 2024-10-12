import React, { useState, useEffect } from 'react';
import styles from './ContextMenuWheel.module.css';

// Import your icons
import StyleIcon from '../../../assets/icons/style.svg';
import DeleteIcon from '../../../assets/icons/delete.svg';
import CopyIcon from '../../../assets/icons/copy.svg';
import TransplantIcon from '../../../assets/icons/transplant.svg';
import AddIcon from '../../../assets/icons/add.svg';
import ShapeIcon from '../../../assets/icons/shapesicon.svg';
import ZoomIcon from '../../../assets/icons/zoom.svg';
import UndoIcon from '../../../assets/icons/undo.svg';
import RedoIcon from '../../../assets/icons/redo.svg';

const ContextMenuWheel = ({ x, y, nodeId, onAction, contextType }) => {
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    console.log(`ContextMenuWheel: ${contextType} menu opened at (${x}, ${y}), nodeId: ${nodeId}`);
  }, [x, y, contextType, nodeId]);

  const nodeActions = [
    { name: 'add', label: 'Add branch', icon: AddIcon },
    { name: 'delete', label: 'Delete branch', icon: DeleteIcon },
    { name: 'copy', label: 'Copy branch', icon: CopyIcon },
    { name: 'transplant', label: 'Transplant', icon: TransplantIcon },
    { name: 'shape', label: 'Change shape', icon: ShapeIcon },
  ];

  const spaceActions = [
    { name: 'paste', label: 'Paste branch', icon: CopyIcon },
    { name: 'add', label: 'Add node', icon: AddIcon },
  ];

  const actions = contextType === 'node' ? nodeActions : spaceActions;

  const radius = 100;
  const innerRadius = 40;
  const angleStep = (2 * Math.PI) / actions.length;

  const handleAction = (actionName, nodeId) => {
    console.log(`Action triggered: ${actionName} for ${contextType}`);
    onAction(actionName, nodeId);
  };

  const handleMouseEnter = (action) => {
    setHoveredAction(action);
  };

  const handleMouseLeave = () => {
    setHoveredAction(null);
  };

  return (
    <div 
      className={styles.contextMenuWrapper} 
      style={{ left: x - radius, top: y - radius }}
    >
      <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle cx={radius} cy={radius} r={radius} className={styles.menuBackground} />
        <circle cx={radius} cy={radius} r={innerRadius} className={styles.menuCenter} />
        {actions.map((action, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x1 = radius + innerRadius * Math.cos(angle);
          const y1 = radius + innerRadius * Math.sin(angle);
          const x2 = radius + radius * Math.cos(angle);
          const y2 = radius + radius * Math.sin(angle);
          const x3 = radius + radius * Math.cos(angle + angleStep);
          const y3 = radius + radius * Math.sin(angle + angleStep);
          const x4 = radius + innerRadius * Math.cos(angle + angleStep);
          const y4 = radius + innerRadius * Math.sin(angle + angleStep);

          return (
            <g 
              key={action.name} 
              onClick={() => handleAction(action.name, nodeId)}
              onMouseEnter={() => handleMouseEnter(action)}
              onMouseLeave={handleMouseLeave}
            >
              <path
                className={styles.menuSector}
                d={`M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 0 1 ${x4} ${y4} L ${x3} ${y3} A ${radius} ${radius} 0 0 0 ${x2} ${y2} Z`}
              />
              <image
                className={styles.icon}
                href={action.icon}
                x={radius + (radius + innerRadius) / 2 * Math.cos(angle + angleStep / 2) - 12}
                y={radius + (radius + innerRadius) / 2 * Math.sin(angle + angleStep / 2) - 12}
                width="24"
                height="24"
              />
            </g>
          );
        })}
      </svg>
      {hoveredAction && (
        <div className={styles.legend}>
          {hoveredAction.label}
        </div>
      )}
    </div>
  );
};

export default ContextMenuWheel;
