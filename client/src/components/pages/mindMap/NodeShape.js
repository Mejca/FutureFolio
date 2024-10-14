import React from 'react';

const NodeShape = ({ shape, width, height, color }) => {
  switch (shape) {
    case 'ellipse':
      return <ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={color} />;
    case 'diamond':
      return (
        <polygon
          points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
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
        [0, height * 0.5],
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
        [0, height * 0.29],
      ].map(point => point.join(',')).join(' ');
      return <polygon points={octagonPoints} fill={color} />;
    case 'rectangle':
    default:
      return <rect width={width} height={height} fill={color} />;
  }
};

export default NodeShape;
