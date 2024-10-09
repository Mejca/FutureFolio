import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './Node.module.css';

const Node = ({ node, onDrag, onContextMenu, isEditing, onEditComplete }) => {
  const nodeRef = useRef(null);
  const [editText, setEditText] = useState(node.text);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const svg = nodeRef.current.closest('svg');
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const startPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
    dragStartRef.current = { x: startPoint.x - node.x, y: startPoint.y - node.y };
    setIsDragging(true);
  }, [node]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const svg = nodeRef.current.closest('svg');
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const cursorPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
    const newX = cursorPoint.x - dragStartRef.current.x;
    const newY = cursorPoint.y - dragStartRef.current.y;
    onDrag(node.id, newX, newY);
  }, [isDragging, node, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(e, node.id);
  };

  const handleEditComplete = () => {
    onEditComplete(editText);
  };

  return (
    <g
      ref={nodeRef}
      className={`${styles.node} ${isDragging ? styles.dragging : ''}`}
      transform={`translate(${node.x}, ${node.y})`}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <rect
        className={styles.nodeRect}
        width={node.width}
        height={node.height}
        rx="5"
        ry="5"
      />
      {isEditing ? (
        <foreignObject width={node.width} height={node.height}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditComplete}
            autoFocus
            className={styles.editInput}
          />
        </foreignObject>
      ) : (
        <text
          x={node.width / 2}
          y={node.height / 2}
          className={styles.nodeText}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {node.text}
        </text>
      )}
    </g>
  );
};

export default React.memo(Node);