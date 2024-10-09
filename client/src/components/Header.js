// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        FutureFolio
      </Typography>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/courses">Courses</Button>
      <Button color="inherit" component={Link} to="/modules">Modules</Button>
    </Toolbar>
  </AppBar>
);

export default Header;
