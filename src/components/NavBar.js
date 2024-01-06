// src/components/NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Switch, FormControlLabel } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const NavBar = ({ toggleTheme, isDarkTheme }) => {
  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Job Application Tracker</Typography>
        <div>
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
