import React, { useCallback, useEffect } from 'react';
import Node from './Node';
import Link from './Link';
import AddButton from './AddButton';
import styles from './MindMapCanvas.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useMindMap } from './MindMapContext';

const MindMapCanvas = () => {
  const { state, addNode, updateNode, setEditingNode } = useMindMap();

  useEffect(() => {
    if (state.nodes.length === 0) {
      const initialNode = {
        id: uuidv4(),
        text: 'Chapter 1: Introduction to AI Safety',
        x: 400,
        y: 300,
        width: 200,
        height: 60,
      };
      addNode(initialNode);

      const childNodes = [
        { id: uuidv4(), text: '1.1 What is AI Safety?', x: 200, y: 150, width: 150, height: 50 },
        { id: uuidv4(), text: '1.2 Key Concepts', x: 600, y: 150, width: 150, height: 50 },
        { id: uuidv4(), text: '1.3 Importance of AI Safety', x: 400, y: 450, width: 150, height: 50 },
      ];

      childNodes.forEach(node => addNode(node));
    }
  }, [state.nodes.length, addNode]);

  const handleNodeDrag = useCallback((nodeId, newX, newY) => {
    updateNode(nodeId, { x: newX, y: newY });
  }, [updateNode]);

  const handleNodeEdit = useCallback((nodeId, updates) => {
    updateNode(nodeId, updates);
  }, [updateNode]);

  const handleAddNode = useCallback((x, y) => {
    const newNode = {
      id: uuidv4(),
      text: 'New Node',
      x,
      y,
      width: 100,
      height: 50,
    };
    addNode(newNode);
  }, [addNode]);

  return (
    <svg className={styles.canvas} width="100%" height="600">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
        </marker>
      </defs>
      {state.links.map(link => (
        <Link key={`${link.source}-${link.target}`} link={link} nodes={state.nodes} />
      ))}
      {state.nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          onDrag={handleNodeDrag}
          onEditComplete={handleNodeEdit}
        />
      ))}
      <AddButton
        position={{ x: 50, y: 50 }}
        onClick={() => handleAddNode(50, 50)}
      />
    </svg>
  );
};

export default MindMapCanvas;
