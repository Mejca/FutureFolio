import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './MindMap.module.css';
import Node from './Node';
import Link from './Link';
import ContextMenuWheel from './ContextMenuWheel';
import NodeShape from './NodeShape';
import { useTheme } from '../../../contexts/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const inputRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const { darkMode } = useTheme();
  const [clipboard, setClipboard] = useState(null);

  const addNode = useCallback((parentId = null, text = 'New Node') => {
    const newNode = {
      id: uuidv4(),
      text,
      x: parentId ? 0 : 500,
      y: parentId ? 0 : 300,
      width: 100,
      height: 50,
      color: getRandomColor(),
      shape: 'rectangle'
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    if (parentId) {
      setLinks(prevLinks => [...prevLinks, { source: parentId, target: newNode.id }]);
    }
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setLinks(prevLinks => prevLinks.filter(link => link.source !== nodeId && link.target !== nodeId));
  }, []);

  const handleNodeDrag = useCallback((nodeId, newX, newY) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, x: newX, y: newY } : node
      )
    );
  }, []);

  const handleContextMenu = useCallback((e, nodeId = null) => {
    e.preventDefault();
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    setContextMenu({
      x,
      y,
      nodeId,
      contextType: nodeId ? 'node' : 'space',
    });
  }, []);

  const copyBranch = useCallback((nodeId) => {
    const nodeToCopy = nodes.find(node => node.id === nodeId);
    if (nodeToCopy) {
      setClipboard(nodeToCopy);
    }
  }, [nodes]);

  const pasteBranch = useCallback((x, y) => {
    if (clipboard) {
      const newNode = {
        ...clipboard,
        id: uuidv4(),
        x,
        y
      };
      setNodes(prevNodes => [...prevNodes, newNode]);
    }
  }, [clipboard]);

  const deleteBranch = useCallback((nodeId) => {
    const nodesToDelete = new Set();

    const deleteRecursive = (id) => {
      nodesToDelete.add(id);
      links.forEach(link => {
        if (link.source === id) deleteRecursive(link.target);
      });
    };

    deleteRecursive(nodeId);

    setNodes(prevNodes => prevNodes.filter(node => !nodesToDelete.has(node.id)));
    setLinks(prevLinks => prevLinks.filter(link => !nodesToDelete.has(link.source) && !nodesToDelete.has(link.target)));
  }, [links]);

  const transplantBranch = useCallback((sourceId, targetId) => {
    setLinks(prevLinks => {
      const newLinks = prevLinks.filter(link => link.target !== sourceId);
      return [...newLinks, { source: targetId, target: sourceId }];
    });
  }, []);

  const changeNodeShape = useCallback((nodeId) => {
    const shapes = ['rectangle', 'ellipse', 'diamond', 'hexagon', 'octagon'];
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === nodeId ? { ...node, shape: shapes[(shapes.indexOf(node.shape) + 1) % shapes.length] } : node
    ));
  }, []);

  const handleContextMenuAction = useCallback((actionName, nodeId) => {
    switch (actionName) {
      case 'add':
        addNode(nodeId);
        break;
      case 'delete':
        deleteNode(nodeId);
        break;
      case 'copy':
        copyBranch(nodeId);
        break;
      case 'paste':
        if (contextMenu) {
          pasteBranch(contextMenu.x, contextMenu.y);
        }
        break;
      case 'transplant':
        console.log('Transplant action triggered for node:', nodeId);
        break;
      case 'shape':
        changeNodeShape(nodeId);
        break;
      default:
        console.log(`Action ${actionName} not implemented for node ${nodeId}`);
    }
    setContextMenu(null);
  }, [addNode, deleteNode, copyBranch, pasteBranch, changeNodeShape, contextMenu]);

  const handleZoomWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY;
      const zoomFactor = delta > 0 ? 0.9 : 1.1;
      
      setScale(prevScale => {
        const newScale = prevScale * zoomFactor;
        return Math.min(Math.max(newScale, 0.1), 5);
      });

      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setPan(prevPan => ({
        x: mouseX - (mouseX - prevPan.x) * zoomFactor,
        y: mouseY - (mouseY - prevPan.y) * zoomFactor
      }));
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  };

  useEffect(() => {
    if (nodes.length === 0) {
      addNode();
    }
  }, [addNode, nodes.length]);

  return (
    <div 
      className={`${styles.mindMapContainer} ${darkMode ? styles.darkMode : ''}`} 
      onWheel={handleZoomWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <svg
        ref={svgRef}
        className={styles.mindMap}
        width="100%"
        height="100%"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          {links.map((link) => (
            <Link key={`${link.source}-${link.target}`} link={link} nodes={nodes} darkMode={darkMode} />
          ))}
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              onDrag={handleNodeDrag}
              onContextMenu={handleContextMenu}
              darkMode={darkMode}
              onUpdate={handleNodeUpdate}
            >
              <NodeShape shape={node.shape} width={node.width} height={node.height} color={node.color} />
            </Node>
          ))}
        </g>
      </svg>
      {contextMenu && (
        <ContextMenuWheel
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onAction={handleContextMenuAction}
          contextType={contextMenu.contextType}
        />
      )}
    </div>
  );
};

export default MindMap;
