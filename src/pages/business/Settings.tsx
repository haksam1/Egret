import React from 'react';
import { Box, Typography, Container, Paper, Grid, Switch, FormControlLabel, Button } from '@mui/material';

const BusinessSettings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Settings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <FormControlLabel
                control={<Switch />}
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="SMS Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Privacy
              </Typography>
              <FormControlLabel
                control={<Switch />}
                label="Show Business Profile"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default BusinessSettings; 