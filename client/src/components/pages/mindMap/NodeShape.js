import React from 'react';

const NodeShape = ({ shape, width, height, color }) => {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (shape) {
    case 'rectangle':
      return <rect width={width} height={height} rx="5" ry="5" fill={color} />;
    case 'ellipse':
      return <ellipse rx={width / 2} ry={height / 2} cx={centerX} cy={centerY} fill={color} />;
    case 'diamond':
      return (
        <polygon
          points={`${centerX},0 ${width},${centerY} ${centerX},${height} 0,${centerY}`}
          fill={color}
        />
      );
    case 'hexagon':
      const hexagonPoints = [
        [width * 0.25, 0],
        [width * 0.75, 0],
        [width, height * 0.5],
        [width * 0.75, height],
        [width * 0.25, height],
        [0, height * 0.5]
      ].map(point => point.join(',')).join(' ');
      return <polygon points={hexagonPoints} fill={color} />;
    case 'octagon':
      const octagonPoints = [
        [width * 0.29, 0],
        [width * 0.71, 0],
        [width, height * 0.29],
        [width, height * 0.71],
        [width * 0.71, height],
        [width * 0.29, height],
        [0, height * 0.71],
        [0, height * 0.29]
      ].map(point => point.join(',')).join(' ');
      return <polygon points={octagonPoints} fill={color} />;
    case 'cloud':
      return (
        <path
          d={`M${width*0.2},${height*0.5} C${width*0.05},${height*0.3} ${width*0.15},${height*0.1} ${width*0.4},${height*0.1} C${width*0.6},${height*0.1} ${width*0.8},${height*0.2} ${width*0.8},${height*0.5} C${width*0.95},${height*0.5} ${width},${height*0.7} ${width*0.85},${height*0.9} C${width*0.7},${height} ${width*0.3},${height} ${width*0.15},${height*0.9} C${width*0},${height*0.7} ${width*0.05},${height*0.5} ${width*0.2},${height*0.5}`}
          fill={color}
        />
      );
    case 'star':
      const starPoints = Array.from({length: 10}, (_, i) => {
        const angle = Math.PI * 2 * i / 10 - Math.PI / 2;
        const r = i % 2 === 0 ? width / 2 : width / 4;
        return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
      }).join(' ');
      return <polygon points={starPoints} fill={color} />;
    default:
      return <rect width={width} height={height} rx="5" ry="5" fill={color} />;
  }
};

export default NodeShape;