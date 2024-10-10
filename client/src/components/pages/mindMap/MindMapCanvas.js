import React, { useState, useCallback, useEffect } from 'react';
import Node from './Node';
import Link from './Link';
import AddButton from './AddButton';
import styles from './MindMapCanvas.module.css';
import { v4 as uuidv4 } from 'uuid';

const MindMapCanvas = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const initialNode = {
      id: uuidv4(), // Use uuid to generate a unique ID
      text: 'Chapter 1: Introduction to AI Safety',
      x: 400,
      y: 300,
      width: 200,
      height: 60,
    };
    setNodes([initialNode]);

    const childNodes = [
      { id: uuidv4(), text: '1.1 What is AI Safety?', x: 200, y: 150, width: 150, height: 50 },
      { id: uuidv4(), text: '1.2 Key Concepts', x: 600, y: 150, width: 150, height: 50 },
      { id: uuidv4(), text: '1.3 Importance of AI Safety', x: 400, y: 450, width: 150, height: 50 },
    ];

    setNodes(prevNodes => [...prevNodes, ...childNodes]);

    const initialLinks = childNodes.map(child => ({
      source: initialNode.id,
      target: child.id,
    }));

    setLinks(initialLinks);
  }, []);

  const handleNodeClick = useCallback((nodeId) => {
    setSelectedNode(nodeId);
  }, []);

  const handleNodeDrag = useCallback((nodeId, newX, newY) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, x: newX, y: newY }
          : node
      )
    );
  }, []);

  const handleNodeEdit = useCallback((nodeId, updates) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  console.log('Rendering MindMapCanvas, nodes:', nodes);

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
      {links.map(link => (
        <Link key={`${link.source}-${link.target}`} link={link} nodes={nodes} />
      ))}
      {nodes.map(node => (
        <Node
          key={node.id} // Ensure each node has a unique key
          node={node}
          onClick={handleNodeClick}
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