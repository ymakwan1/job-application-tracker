// src/components/JobList.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>
      </Typography>
      {jobs.map((job) => (
        <Card key={job.id} variant="outlined" style={{ marginBottom: '16px', backgroundColor: '#f0f0f0' }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {job.title}
            </Typography>
            <Typography color="textSecondary">{job.company}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobList;