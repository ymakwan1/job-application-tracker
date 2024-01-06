import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import NavBar from './components/NavBar';
import './App.css';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const addJob = (job) => {
    setJobs([...jobs, job]);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    // Apply theme change to localStorage
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  useEffect(() => {
    // Retrieve theme preference from localStorage
    const storedTheme = localStorage.getItem('darkTheme');
    if (storedTheme) {
      setIsDarkTheme(JSON.parse(storedTheme));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container">
        <NavBar toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        <div className="paper-container">
          <JobForm onSubmit={addJob} />
          <JobList jobs={jobs} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
