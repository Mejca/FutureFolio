import React, { useState, useEffect, useRef } from 'react';
import styles from './NodeEditBox.module.css';

const NodeEditBox = ({ node, onUpdate, onClose }) => {
  const [text, setText] = useState(node.text);
  const [size, setSize] = useState({ width: node.width || 100, height: node.height || 50 });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleUpdate = () => {
    onUpdate({ text, width: size.width, height: size.height });
  };

  // ... other functions

  return (
    <foreignObject
      x={node.x}
      y={node.y}
      width={size.width}
      height={size.height}
    >
      <div className={styles.editBox} style={{ width: size.width, height: size.height }}>
        {/* ... toolbar */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleUpdate}
          className={styles.editInput}
        />
        {/* ... resize handle */}
      </div>
    </foreignObject>
  );
};

export default NodeEditBox;