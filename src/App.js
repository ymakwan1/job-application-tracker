import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import JobForm from './components/JobForm';
import NavBar from './components/NavBar';
import UpdateJob from './components/UpdateJob';

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
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  useEffect(() => {
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
          <Routes>
            <Route path="/" element={<JobForm onSubmit={addJob} />} />
            <Route path="/update-job" element={<UpdateJob />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
