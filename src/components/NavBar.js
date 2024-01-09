// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Switch, FormControlLabel } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavBar = ({ toggleTheme, isDarkTheme }) => {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Job Application Tracker
          </Link>
        </Typography>
        <div>
          <Link to="/show-jobs" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
            Show Jobs
          </Link>
          <Link to="/update-job" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
            Update Job
          </Link>
          {/* ... (other links) */}
          <FormControlLabel
            control={
              <Switch
                checked={isDarkTheme}
                onChange={toggleTheme}
                icon={<Brightness4Icon />}
                checkedIcon={<Brightness7Icon />}
              />
            }
            label={isDarkTheme ? 'Dark' : 'Light'}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
