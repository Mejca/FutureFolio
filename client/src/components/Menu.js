// client/src/components/Menu.js

import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div>
      <h1>Menu</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/modules">Modules</Link></li>
        <li><Link to="/module-selection">Module Selection Tool</Link></li>
        <li><Link to="/mind-map">Mind Map</Link></li>
      </ul>
    </div>
  );
};

export default Menu;
