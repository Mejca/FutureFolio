import React, { useState, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import ContextMenuWheel from './ContextMenuWheel';
import { v4 as uuidv4 } from 'uuid';
import styles from './MindMap.module.css';

const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const reactFlowWrapper = useRef(null);

  useEffect(() => {
    if (nodes.length === 0) {
      const newNode = {
        id: uuidv4(),
        data: { label: 'Central Idea' },
        position: { x: 250, y: 250 },
        style: { backgroundColor: 'lightblue', width: 150, height: 50 }
      };
      setNodes([newNode]);
    }
  }, [nodes.length, setNodes]);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top,
      nodeId: node.id,
      contextType: 'node'  // Set contextType to 'node' when right-clicking a node
    });
  };

  const onPaneContextMenu = (event) => {
    event.preventDefault();
    const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top,
      contextType: 'space'  // Set contextType to 'space' when right-clicking the pane
    });
  };

  const onPaneClick = () => setContextMenu(null);

  const addNewNode = (x, y) => {
    const newNode = {
      id: uuidv4(),
      data: { label: 'New Node' },
      position: { x, y },
      style: { backgroundColor: 'lightgreen', width: 100, height: 40 }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onContextMenuAction = (action) => {
    if (action === 'add' && contextMenu) {
      addNewNode(contextMenu.x, contextMenu.y);
    }
    // Add other actions as needed
    setContextMenu(null);
  };

  const onCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className={styles.mindMapContainer} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {contextMenu && (
        <ContextMenuWheel
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          contextType={contextMenu.contextType}
          onAction={onContextMenuAction}
          onClose={onCloseContextMenu}
        />
      )}
    </div>
  );
};

export default MindMap;
