import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './MindMap.module.css';
import Node from './Node';
import Link from './Link';
import ContextMenuWheel from './ContextMenuWheel';
import _NodeShape from './NodeShape';  // Prefix with underscore
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

  // Simulated student profile data
  const studentProfile = {
    name: "John Doe",
    highSchool: "Springfield High",
    pastEndeavors: ["AP Computer Science", "Robotics Club"],
    currentEndeavors: ["Computer Science Major", "AI Research Assistant"],
    futureEndeavors: ["Machine Learning Internship", "Graduate Studies"],
    compulsoryModules: ["CS101", "CS201", "MATH101"],
    completedModules: ["CS101", "MATH101"],
    currentModules: ["CS201", "CS301"],
    plannedModules: ["CS401", "AI501"],
    prerequisites: {
      "CS201": ["CS101"],
      "CS301": ["CS201"],
      "CS401": ["CS301"],
      "AI501": ["CS301", "MATH101"]
    }
  };

  // Define all functions before using them in useCallback

  const deleteNode = useCallback((nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setLinks(prevLinks => prevLinks.filter(link => link.source !== nodeId && link.target !== nodeId));
  }, []);

  const addChildNode = useCallback((parentId) => {
    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;

    const newNode = {
      id: uuidv4(),
      text: 'New Node',
      x: parentNode.x + 150,
      y: parentNode.y + 50,
      width: 100,
      height: 50,
      color: '#4285f4',
      level: (parentNode.level || 0) + 1
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setLinks(prevLinks => [...prevLinks, { source: parentId, target: newNode.id }]);
  }, [nodes]);

  const changeNodeShape = useCallback((nodeId) => {
    const shapes = ['rectangle', 'ellipse', 'diamond', 'hexagon', 'octagon'];
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === nodeId ? { ...node, shape: shapes[(shapes.indexOf(node.shape) + 1) % shapes.length] } : node
    ));
  }, []);

  const changeNodeColor = useCallback((nodeId) => {
    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#ff6d01'];
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === nodeId ? { ...node, color: colors[(colors.indexOf(node.color) + 1) % colors.length] } : node
    ));
  }, []);

  const addMediaToNode = useCallback((nodeId) => {
    // Placeholder for media addition logic
    console.log(`Add media to node ${nodeId}`);
  }, []);

  const handleZoom = useCallback((factor) => {
    setScale(prevScale => prevScale * factor);
  }, []);

  const centerMap = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const rootNode = nodes.find(node => node.id === 'root');
    if (!rootNode) return;

    const dx = centerX - rootNode.x;
    const dy = centerY - rootNode.y;
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      x: node.x + dx,
      y: node.y + dy
    })));
  }, [nodes]);

  // New feature: Auto-arrange nodes
  const autoArrangeNodes = useCallback(() => {
    // Simple auto-arrange logic (you may want to implement a more sophisticated algorithm)
    const rootNode = nodes.find(node => node.id === 'root');
    if (!rootNode) return;

    const arrangeRecursive = (node, level, index, maxNodesPerLevel) => {
      const angle = (index - maxNodesPerLevel / 2 + 0.5) * (2 * Math.PI / maxNodesPerLevel);
      const radius = level * 200;
      return {
        ...node,
        x: rootNode.x + radius * Math.cos(angle),
        y: rootNode.y + radius * Math.sin(angle)
      };
    };

    const arrangedNodes = nodes.map((node, index) => {
      if (node.id === 'root') return node;
      const level = links.filter(link => link.target === node.id).length;
      const maxNodesPerLevel = Math.max(...nodes.map(n => links.filter(link => link.target === n.id).length));
      return arrangeRecursive(node, level, index, maxNodesPerLevel);
    });

    setNodes(arrangedNodes);
  }, [nodes, links]);

  // New feature: Copy branch
  const copyBranch = useCallback((nodeId) => {
    const originalNode = nodes.find(node => node.id === nodeId);
    if (!originalNode) return;

    const copyRecursive = (originalId, parentId = null) => {
      const original = nodes.find(node => node.id === originalId);
      const newId = uuidv4(); // Use uuid to generate a unique ID
      const newNode = { ...original, id: newId, x: original.x + 50, y: original.y + 50 };
      
      setNodes(prevNodes => [...prevNodes, newNode]);
      if (parentId) {
        setLinks(prevLinks => [...prevLinks, { source: parentId, target: newId }]);
      }

      const childLinks = links.filter(link => link.source === originalId);
      childLinks.forEach(link => copyRecursive(link.target, newId));
    };

    copyRecursive(nodeId);
  }, [nodes, links]);

  const deleteBranch = useCallback((nodeId) => {
    setNodes(prevNodes => {
      const nodesToDelete = new Set();
      const deleteRecursive = (id) => {
        nodesToDelete.add(id);
        links.filter(link => link.source === id).forEach(link => deleteRecursive(link.target));
      };
      deleteRecursive(nodeId);
      return prevNodes.filter(node => !nodesToDelete.has(node.id));
    });
    setLinks(prevLinks => prevLinks.filter(link => !link.source === nodeId && !link.target === nodeId));
  }, [links]);

  const transplantBranch = useCallback((sourceId, targetId) => {
    setLinks(prevLinks => {
      const newLinks = prevLinks.filter(link => link.target !== sourceId);
      return [...newLinks, { source: targetId, target: sourceId }];
    });
  }, []);

  const autoArrange = useCallback(() => {
    const rootNode = nodes.find(node => node.id === 'root');
    if (!rootNode) return;

    const arrangeRecursive = (node, level, index, maxNodesPerLevel) => {
      const angle = (index - maxNodesPerLevel / 2 + 0.5) * (2 * Math.PI / maxNodesPerLevel);
      const radius = level * 200;
      return {
        ...node,
        x: rootNode.x + radius * Math.cos(angle),
        y: rootNode.y + radius * Math.sin(angle),
        level: level
      };
    };

    const arrangedNodes = nodes.map((node, index) => {
      if (node.id === 'root') return { ...node, level: 0 };
      const level = links.filter(link => link.target === node.id).length;
      const maxNodesPerLevel = Math.max(...nodes.map(n => links.filter(link => link.target === n.id).length));
      return arrangeRecursive(node, level, index, maxNodesPerLevel);
    });

    setNodes(arrangedNodes);
  }, [nodes, links]);

  const handleNodeContextMenu = useCallback((e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        nodeId: nodeId,
      });
    }
  }, [nodes]);

  const handleBackgroundContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId: null,
    });
  }, []);

  const handleContextMenuAction = useCallback((action, nodeId) => {
    console.log('Context menu action:', action, 'for node:', nodeId);
    switch (action) {
      case 'add':
        addChildNode(nodeId || 'root');
        break;
      case 'edit':
        setEditingNode(nodeId);
        break;
      case 'delete':
        deleteNode(nodeId);
        break;
      case 'copy':
        // Implement copy functionality
        break;
      case 'paste':
        // Implement paste functionality
        break;
      case 'arrange':
        autoArrange();
        break;
      default:
        console.log('Unhandled action:', action);
    }
    setContextMenu(null);
  }, [addChildNode, deleteNode, autoArrange]);

  const addProfileDetails = useCallback((parentId, items, yOffset) => {
    setNodes(prevNodes => {
      const parent = prevNodes.find(node => node.id === parentId);
      if (!parent) return prevNodes;

      const newNodes = [...prevNodes];
      items.forEach((item, index) => {
        const angle = (index - (items.length - 1) / 2) * 0.5;
        const x = parent.x + Math.cos(angle) * 150;
        const y = parent.y + yOffset + Math.sin(angle) * 50;

        const newNode = {
          id: `${parentId}-${index}`,
          text: item,
          x,
          y,
          color: getRandomColor()
        };
        newNodes.push(newNode);
        setLinks(prevLinks => [...prevLinks, { source: parentId, target: newNode.id }]);
      });
      return newNodes;
    });
  }, [setLinks]);

  const CircularMenu = ({ x, y, options = [], onClose }) => {
    const radius = 80;
    const angleStep = (2 * Math.PI) / options.length;

    return (
      <div className={styles.circularMenu} style={{ left: x - radius, top: y - radius }}>
        {options.map((option, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const itemX = radius * Math.cos(angle) + radius;
          const itemY = radius * Math.sin(angle) + radius;
          return (
            <div
              key={index}
              className={styles.circularMenuItem}
              style={{
                left: `${itemX}px`,
                top: `${itemY}px`,
              }}
              onClick={() => {
                option.action();
                onClose();
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    );
  };

  const Legend = () => (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <div className={styles.legendColor} style={{ backgroundColor: '#2ecc71' }}></div>
        <span>Completed</span>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.legendColor} style={{ backgroundColor: '#3498db' }}></div>
        <span>In Progress</span>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.legendColor} style={{ backgroundColor: '#e74c3c' }}></div>
        <span>Planned</span>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.legendLine}></div>
        <span>Prerequisite</span>
      </div>
    </div>
  );

  const handleEditComplete = useCallback((nodeId, newText) => {
    if (newText) {
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === nodeId ? { ...node, text: newText } : node
        )
      );
    }
    setEditingNode(null);
  }, [nodes]);

  const addNode = useCallback((parentId, text = 'New Node') => {
    if (!parentId) return;

    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;

    const newNode = {
      id: `node${nodes.length + 1}`,
      text,
      x: parentNode.x + 150,
      y: parentNode.y + (Math.random() - 0.5) * 100,
      color: getRandomColor()
    };

    setNodes(prevNodes => [...prevNodes, newNode]);
    setLinks(prevLinks => [...prevLinks, { source: parentId, target: newNode.id }]);
  }, [nodes]);

  const editNode = useCallback((nodeId) => {
    if (!nodeId) return;

    const node = nodes.find(node => node.id === nodeId);
    if (!node) return;

    setEditingNode(nodeId);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [nodes]);

  const handleDrag = useCallback((id, action, x = 0, y = 0) => {
    if (action === 'move') {
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === id ? { ...node, x: node.x + x, y: node.y + y } : node
        )
      );
    }
  }, [nodes]);

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const changeLinkColor = () => {
    // Implement link color change logic
    console.log('Change link color');
  };

  const deleteLink = () => {
    // Implement link deletion logic
    console.log('Delete link');
  };

  // Update zoom function to use mousewheel + ctrl
  const handleZoomWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY;
      // ... rest of the zoom logic
    }
  }, [/* dependencies */]);

  const loadStudentProfile = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const profileNodes = [
      { id: uuidv4(), text: studentProfile.name, x: centerX, y: centerY, color: '#f1c40f' },
      { id: uuidv4(), text: studentProfile.highSchool, x: centerX - 200, y: centerY - 100, color: '#3498db' },
      { id: uuidv4(), text: 'Past Endeavors', x: centerX - 100, y: centerY - 200, color: '#2ecc71' },
      { id: uuidv4(), text: 'Current Endeavors', x: centerX + 100, y: centerY - 200, color: '#e74c3c' },
      { id: uuidv4(), text: 'Future Endeavors', x: centerX + 200, y: centerY - 100, color: '#9b59b6' },
      { id: uuidv4(), text: 'Modules', x: centerX, y: centerY + 200, color: '#f39c12' },
    ];

    const profileLinks = [
      { source: 'root', target: 'highSchool' },
      { source: 'root', target: 'past' },
      { source: 'root', target: 'current' },
      { source: 'root', target: 'future' },
      { source: 'root', target: 'modules' },
    ];

    setNodes(profileNodes);
    setLinks(profileLinks);

    // Use setTimeout to ensure the initial nodes are set before adding details
    setTimeout(() => {
      addProfileDetails('past', studentProfile.pastEndeavors, 100);
      addProfileDetails('current', studentProfile.currentEndeavors, 100);
      addProfileDetails('future', studentProfile.futureEndeavors, 100);

      // Add modules
      const moduleCategories = [
        { id: 'completed', text: 'Completed', items: studentProfile.completedModules },
        { id: 'current', text: 'Current', items: studentProfile.currentModules },
        { id: 'planned', text: 'Planned', items: studentProfile.plannedModules },
      ];

      moduleCategories.forEach((category, index) => {
        const angle = (index - 1) * Math.PI / 3;
        const x = window.innerWidth / 2 + Math.cos(angle) * 200;
        const y = window.innerHeight / 2 + 200 + Math.sin(angle) * 100;
        setNodes(prevNodes => [...prevNodes, { id: category.id, text: category.text, x, y, color: getRandomColor() }]);
        setLinks(prevLinks => [...prevLinks, { source: 'modules', target: category.id }]);

        addProfileDetails(category.id, category.items, 80);
      });


      // Add prerequisites
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        Object.entries(studentProfile.prerequisites).forEach(([module, prereqs]) => {
          const moduleNode = newNodes.find(node => node.text === module);
          if (moduleNode) {
            prereqs.forEach(prereq => {
              const prereqNode = newNodes.find(node => node.text === prereq);
              if (prereqNode) {
                setLinks(prevLinks => [...prevLinks, { source: prereqNode.id, target: moduleNode.id, isPrereq: true }]);
              }
            });
          }
        });
        return newNodes;
      });
    }, 0);
  }, [addProfileDetails]);

  useEffect(() => {
    loadStudentProfile();
  }, [loadStudentProfile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu && !e.target.closest(`.${styles.contextMenuWrapper}`)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  // Update the initial state to have only one node
  useEffect(() => {
    const initialNode = {
      id: 'root',
      text: 'Central Idea',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 120,
      height: 60,
      color: '#4285f4',
    };
    setNodes([initialNode]);
  }, []);

  // Implement node dragging
  const handleNodeDrag = useCallback((nodeId, newX, newY) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, x: newX, y: newY } : node
      )
    );
  }, []);

  // Implement context menu
  const handleContextMenu = useCallback((e, nodeId) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId: nodeId,
    });
  }, []);

  return (
    <div 
      className={`${styles.mindMapContainer} ${darkMode ? styles.darkMode : ''}`} 
      onWheel={handleZoomWheel}
      onContextMenu={(e) => handleContextMenu(e, null)}
    >
      <svg
        ref={svgRef}
        className={styles.mindMap}
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          {links.map((link, index) => (
            <Link key={`${link.source}-${link.target}-${index}`} link={link} nodes={nodes} darkMode={darkMode} />
          ))}
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              onDrag={handleNodeDrag}
              onContextMenu={handleContextMenu}
              isEditing={editingNode === node.id}
              onEditComplete={(newText) => handleEditComplete(node.id, newText)}
              darkMode={darkMode}
            />
          ))}
        </g>
      </svg>
      {contextMenu && (
        <ContextMenuWheel
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};

export default MindMap;