import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './Node.module.css';
import NodeEditBox from './NodeEditBox';
import NodeShape from './NodeShape';
import { useMindMap } from './MindMapContext';

const Node = ({ node, onDrag, onContextMenu, onClick, isTransplantTarget, darkMode, isTransplanting, onUpdate }) => {
  console.log('Node props:', { node, isTransplantTarget, darkMode, isTransplanting });
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { setEditingNode } = useMindMap();

  useEffect(() => {
    console.log('Rendering node:', node); // Debugging log
  }, [node]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const rect = nodeRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const svg = nodeRef.current.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const newX = svgP.x - dragOffset.x;
    const newY = svgP.y - dragOffset.y;
    onDrag(node.id, newX, newY);
  }, [isDragging, dragOffset, node.id, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = nodeRef.current.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    onContextMenu(e, node.id, svgP.x, svgP.y);
  }, [node.id, onContextMenu]);

  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNode(node.id);
  }, [node.id, setEditingNode]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <g
      ref={nodeRef}
      transform={`translate(${node.x}, ${node.y})`}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      className={`${styles.node} ${isDragging ? styles.dragging : ''}`}
    >
      <NodeShape shape={node.shape} width={node.width} height={node.height} color={node.color} />
      <text
        x={node.width / 2}
        y={node.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className={styles.nodeText}
      >
        {node.text}
      </text>
    </g>
  );
};

export default React.memo(Node);
