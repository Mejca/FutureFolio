import React, { useState, useEffect } from 'react';
import MindMapCanvas from './MindMap';

const MindMapTest = () => {
  console.log('Rendering MindMapTest');

  const [testStage, setTestStage] = useState(0);

  useEffect(() => {
    const runTest = async () => {
      // Test node creation
      console.log('Test: Creating nodes');
      document.querySelector('button:nth-child(1)').click(); // Add Node
      document.querySelector('button:nth-child(1)').click(); // Add Node
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test node selection
      console.log('Test: Selecting a node');
      document.querySelector('g').click(); // Click first node
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test node deletion
      console.log('Test: Deleting selected node');
      document.querySelector('button:nth-child(2)').click(); // Delete Selected Node
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Test complete');
    };

    if (testStage === 1) {
      runTest();
    }
  }, [testStage]);

  return (
    <div>
      <h1>Mind Map Test</h1>
      <MindMapCanvas />
      <button onClick={() => setTestStage(1)}>Run Automated Test</button>
    </div>
  );
};

export default MindMapTest;
