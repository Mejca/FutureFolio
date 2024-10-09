import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './MindMap.module.css';

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [pan, setPan] = useState([0, 0]);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const inputRef = useRef(null);

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

  const Node = React.memo(({ data, onAddChild, onEdit, onDrag, onContextMenu }) => {
    const nodeRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        onDrag(data.id, 'move', dx, dy);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, dragStart, data.id, onDrag]);

    const handlePointerDown = (event) => {
      event.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    };

    return (
      <g
        className={styles.node}
        transform={`translate(${data.x}, ${data.y})`}
        ref={nodeRef}
        onMouseDown={handlePointerDown}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(data.id, e.clientX, e.clientY);
        }}
      >
        <rect
          width={120}
          height={40}
          rx={5}
          ry={5}
          fill={data.color || "#f1f1f1"}
          stroke="#999"
        />
        <text
          x={60}
          y={20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onEdit(data.id);
          }}
        >
          {data.text}
        </text>
      </g>
    );
  });


  const Link = React.memo(({ start, end, onContextMenu, isPrereq }) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
      <path
        d={`M${start.x},${start.y} Q${midX},${start.y} ${midX},${midY} T${end.x},${end.y}`}
        fill="none"
        stroke={isPrereq ? "#ff9800" : "#999"}
        strokeWidth={isPrereq ? 2 : 4}
        strokeDasharray={isPrereq ? "5,5" : "none"}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e.clientX, e.clientY);
        }}
      />
    );
  });


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
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeContextMenu = (nodeId, xCoordinate, yCoordinate) => {
    const selectedNode = nodes.find((node) => node.id === nodeId);
    if (!selectedNode) return;

    setContextMenu(
      <CircularMenu
        x={xCoordinate}
        y={yCoordinate}
        options={[
          { label: 'Edit', action: () => editNode(nodeId) },
          { label: 'Delete', action: () => deleteNode(nodeId) },
        ]}
        onClose={() => setContextMenu(null)}
      />
    );
  };

  const handleLinkContextMenu = (x, y) => {
    setContextMenu(
      <CircularMenu
        x={x}
        y={y}
        options={[
          { label: 'Change Color', action: () => changeLinkColor() },
          { label: 'Delete', action: () => deleteLink() },
        ]}
        onClose={() => setContextMenu(null)}
      />
    );
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setContextMenu(
      <CircularMenu
        x={e.clientX}
        y={e.clientY}
        options={[
          { label: 'Add Node', action: () => addNode('root', 'New Node') },
          { label: 'Center Map', action: () => centerMap() },
        ]}
        onClose={() => setContextMenu(null)}
      />
    );
  };

  const deleteNode = (nodeId) => {
    const node = nodes.find(node => node.id === nodeId);
    if (!node) return;

    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setLinks(prevLinks => prevLinks.filter(link => link.source !== nodeId && link.target !== nodeId));
  };


  const changeLinkColor = () => {
    // Implement link color change logic
    console.log('Change link color');
  };

  const deleteLink = () => {
    // Implement link deletion logic
    console.log('Delete link');
  };

  const centerMap = () => {
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
  };

  const [scale, setScale] = useState(1);

  const loadStudentProfile = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const profileNodes = [
      { id: 'root', text: studentProfile.name, x: centerX, y: centerY, color: '#f1c40f' },
      { id: 'highSchool', text: studentProfile.highSchool, x: centerX - 200, y: centerY - 100, color: '#3498db' },
      { id: 'past', text: 'Past Endeavors', x: centerX - 100, y: centerY - 200, color: '#2ecc71' },
      { id: 'current', text: 'Current Endeavors', x: centerX + 100, y: centerY - 200, color: '#e74c3c' },
      { id: 'future', text: 'Future Endeavors', x: centerX + 200, y: centerY - 100, color: '#9b59b6' },
      { id: 'modules', text: 'Modules', x: centerX, y: centerY + 200, color: '#f39c12' },
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

  return (
    <div className={styles.mindMapContainer}>
      <svg
        className={styles.mindMap}
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMinYMin meet"
      >
        {nodes.map((node) => (
          <Node
            key={node.id}
            data={node}
            onAddChild={addNode}
            onEdit={editNode}
            onDrag={handleDrag}
            onContextMenu={handleNodeContextMenu}
          />
        ))}
        {links.map((link, index) => (
          <Link
            key={`${link.source}-${link.target}-${index}`} // Ensure uniqueness by adding index
            start={nodes.find((node) => node.id === link.source)}
            end={nodes.find((node) => node.id === link.target)}
            onContextMenu={handleLinkContextMenu}
            isPrereq={link.isPrereq}
          />
        ))}
      </svg>
      {contextMenu && (
        <CircularMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}
      {editingNode && (
        <input
          ref={inputRef}
          type="text"
          value={nodes.find((node) => node.id === editingNode).text}
          onChange={(e) => handleEditComplete(editingNode, e.target.value)}
          onBlur={() => handleEditComplete(editingNode, null)}
        />
      )}
      <Legend />
    </div>
  );
};


export default MindMap;