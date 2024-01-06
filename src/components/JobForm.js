// src/components/JobForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const JobForm = ({ onSubmit }) => {
  const [jobId, setJobId] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [referral, setReferral] = useState(false);
  const [referrerName, setReferrerName] = useState('');

  // Error states
  const [jobIdError, setJobIdError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [jobTypeError, setJobTypeError] = useState('');
  const [referrerNameError, setReferrerNameError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous errors
    setJobIdError('');
    setTitleError('');
    setCompanyError('');
    setJobTypeError('');
    setReferrerNameError('');

    // Validation checks for required fields
    if (!jobId.trim()) {
      setJobIdError('Job ID is required');
      return;
    }

    if (!title.trim()) {
      setTitleError('Job Title is required');
      return;
    }

    if (!company.trim()) {
      setCompanyError('Company Name is required');
      return;
    }

    if (!jobType) {
      setJobTypeError('Job Type is required');
      return;
    }

    // Additional check for referral and referrerName
    if (referral && !referrerName.trim()) {
      setReferrerNameError('Referrer Name is required if referral is checked');
      return;
    }

    // If all validations pass, submit the form
    axios.post('http://localhost:5000/api/jobs', {
      jobId,
      title,
      company,
      jobType,
      dashboardUrl,
      referral,
      referrerName: referral ? referrerName : null, // Send referrerName only if referral is checked
    })
      .then(response => {
        onSubmit(response.data);
        setJobId('');
        setTitle('');
        setCompany('');
        setJobType('');
        setDashboardUrl('');
        setReferral(false);
        setReferrerName('');
      })
      .catch(error => console.error('Error adding job:', error));
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              error={!!jobIdError}
              helperText={jobIdError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!titleError}
              helperText={titleError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              variant="outlined"
              fullWidth
              margin="normal"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              error={!!companyError}
              helperText={companyError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select
                labelId="job-type-label"
                id="job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                label="Job Type"
                error={!!jobTypeError}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="SWE">SWE</MenuItem>
                <MenuItem value="SDE">SDE</MenuItem>
                <MenuItem value="Data Engineering">Data Engineering</MenuItem>
                <MenuItem value="Automation">Automation</MenuItem>
              </Select>
            </FormControl>
            {jobTypeError && (
              <p style={{ color: 'red', margin: '5px 0 0', fontSize: '0.75rem' }}>{jobTypeError}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dashboard URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={dashboardUrl}
              onChange={(e) => setDashboardUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={referral}
                  onChange={(e) => setReferral(e.target.checked)}
                  color="primary"
                />
              }
              label="Referral"
            />
          </Grid>
          {referral && (
            <Grid item xs={12}>
              <TextField
                label="Referrer Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                error={!!referrerNameError}
                helperText={referrerNameError}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Job
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default JobForm;
