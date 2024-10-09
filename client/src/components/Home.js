import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container>
    <Box textAlign="center" my={4}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to FutureFolio
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Select an option to proceed:
      </Typography>
      <Box my={2}>
        <Button component={Link} to="/module-selection" variant="contained" color="primary">
          Module Selection Tool
        </Button>
      </Box>
      <Box my={2}>
        <Button component={Link} to="/mind-map" variant="contained" color="secondary">
          Mind Map
        </Button>
      </Box>
    </Box>
  </Container>
);

export default Home;
