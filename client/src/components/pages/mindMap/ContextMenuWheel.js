import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

const ContextMenuWheel = React.memo(({ x, y, nodeId, onAction, contextType, onClose, darkMode }) => {
  const [hoveredAction, setHoveredAction] = useState(null);
  console.log('ContextMenuWheel rendered with props:', { x, y, nodeId, contextType });

  useEffect(() => {
    console.log('ContextMenuWheel mounted or updated', { x, y, nodeId, contextType });
    return () => {
      console.log('ContextMenuWheel unmounted or updated', { x, y, nodeId, contextType });
    };
  }, [x, y, nodeId, contextType]);

  const nodeActions = useMemo(() => [
    { name: 'add', label: 'Add branch', icon: AddIcon },
    { name: 'delete', label: 'Delete branch', icon: DeleteIcon },
    { name: 'copy', label: 'Copy branch', icon: CopyIcon },
    { name: 'transplant', label: 'Transplant', icon: TransplantIcon },
    { name: 'style', label: 'Change style', icon: StyleIcon },
    { name: 'shape', label: 'Change shape', icon: ShapeIcon },
  ], []);

  const spaceActions = useMemo(() => [
    { name: 'paste', label: 'Paste branch', icon: CopyIcon },
    { name: 'zoom', label: 'Zoom', icon: ZoomIcon },
    { name: 'redo', label: 'Redo', icon: RedoIcon },
    { name: 'undo', label: 'Undo', icon: UndoIcon },
    { name: 'add', label: 'Add node', icon: AddIcon }, 
    { name: 'blank', label: '', icon: null },
  ], []);

  const actions = useMemo(() => contextType === 'node' ? nodeActions : spaceActions, [contextType, nodeActions, spaceActions]);

  const handleActionClick = useCallback((actionName) => {
    console.log(`Action clicked: ${actionName}`);
    onAction(actionName, nodeId, x, y);
    onClose();
  }, [onAction, nodeId, onClose, x, y]);

  console.log('Rendering context menu wheel');
  const result = (
    <div 
      className={`${styles.contextMenuWrapper} ${darkMode ? styles.darkMode : ''}`} 
      style={{ 
        left: `${x}px`,
        top: `${y}px`,
        position: 'fixed',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
        zIndex: 10000
      }}
    >
      <svg width={200} height={200} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={100} className={styles.menuBackground} />
        <circle cx={100} cy={100} r={40} className={styles.menuCenter} />
        {actions.map((action, index) => {
          const angle = index * (Math.PI / 3) - Math.PI / 2;
          const x1 = 100 + 40 * Math.cos(angle);
          const y1 = 100 + 40 * Math.sin(angle);
          const x2 = 100 + 100 * Math.cos(angle);
          const y2 = 100 + 100 * Math.sin(angle);
          const x3 = 100 + 100 * Math.cos(angle + Math.PI / 3);
          const y3 = 100 + 100 * Math.sin(angle + Math.PI / 3);
          const x4 = 100 + 40 * Math.cos(angle + Math.PI / 3);
          const y4 = 100 + 40 * Math.sin(angle + Math.PI / 3);

          return (
            <g 
              key={action.name} 
              onClick={() => action.name !== 'blank' && handleActionClick(action.name)}
              className={styles.actionGroup}
            >
              <path
                className={`${styles.menuSector} ${action.name === 'blank' ? styles.blankSector : ''}`}
                d={`M ${x1} ${y1} A 40 40 0 0 1 ${x4} ${y4} L ${x3} ${y3} A 100 100 0 0 0 ${x2} ${y2} Z`}
              />
              {action.icon && (
                <image
                  className={styles.icon}
                  href={action.icon}
                  x={100 + 70 * Math.cos(angle + Math.PI / 6) - 12}
                  y={100 + 70 * Math.sin(angle + Math.PI / 6) - 12}
                  width="24"
                  height="24"
                />
              )}
              <text
                className={styles.actionLabel}
                x={100 + 85 * Math.cos(angle + Math.PI / 6)}
                y={100 + 85 * Math.sin(angle + Math.PI / 6)}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {action.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
  console.log('Context menu wheel render complete');
  return result;
}, (prevProps, nextProps) => {
  return prevProps.x === nextProps.x &&
         prevProps.y === nextProps.y &&
         prevProps.nodeId === nextProps.nodeId &&
         prevProps.contextType === nextProps.contextType &&
         prevProps.onAction === nextProps.onAction &&
         prevProps.onClose === nextProps.onClose &&
         prevProps.darkMode === nextProps.darkMode;
});

export default ContextMenuWheel;
