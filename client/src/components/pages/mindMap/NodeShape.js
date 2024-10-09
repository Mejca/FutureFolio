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
    default:
      return <rect width={width} height={height} rx="5" ry="5" fill={color} />;
  }
};

export default NodeShape;
