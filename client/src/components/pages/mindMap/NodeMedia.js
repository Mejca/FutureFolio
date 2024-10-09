import React from 'react';

const NodeMedia = ({ media }) => {
  if (!media) return null;

  switch (media.type) {
    case 'image':
      return <image href={media.url} x="0" y="0" height="30" width="30" />;
    case 'link':
      return (
        <foreignObject x="0" y="0" width="30" height="30">
          <div>
            <a href={media.url} target="_blank" rel="noopener noreferrer">
              🔗
            </a>
          </div>
        </foreignObject>
      );
    default:
      return null;
  }
};

export default NodeMedia;
