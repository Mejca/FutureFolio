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
    onUpdate({ ...node, text, width: size.width, height: size.height });
  };

  const handleResize = (e) => {
    const newWidth = Math.max(e.clientX - node.x, 50);  // Ensure minimum width
    const newHeight = Math.max(e.clientY - node.y, 30); // Ensure minimum height
    setSize({ width: newWidth, height: newHeight });
  };

  return (
    <foreignObject
      x={-5}
      y={-5}
      width={size.width + 10}
      height={size.height + 10}
    >
      <div className={styles.editBox} style={{ width: size.width + 10, height: size.height + 10 }}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleUpdate}
          className={styles.textArea}
        />
        <div
          className={styles.resizeHandle}
          onMouseDown={(e) => {
            e.stopPropagation();
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', () => {
              document.removeEventListener('mousemove', handleResize);
            }, { once: true });
          }}
        />
      </div>
    </foreignObject>
  );
};

export default NodeEditBox;
