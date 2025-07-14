import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const BusinessDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Overview</Typography>
              {/* Add overview content */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Recent Bookings</Typography>
              {/* Add recent bookings content */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Analytics</Typography>
              {/* Add analytics content */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BusinessDashboard; 