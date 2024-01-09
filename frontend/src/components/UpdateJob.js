// src/components/UpdateJobForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';

const UpdateJob = ({ jobData, onUpdate }) => {
  const [jobId, setJobId] = useState(jobData.jobId);
  const [title, setTitle] = useState(jobData.title);
  const [company, setCompany] = useState(jobData.company);
  const [jobType, setJobType] = useState(jobData.jobType);
  const [jobPostingUrl, setJobPostingUrl] = useState(jobData.jobPostingUrl);
  const [dashboardUrl, setDashboardUrl] = useState(jobData.dashboardUrl);
  const [jobPostingSource, setJobPostingSource] = useState(jobData.jobPostingSource);
  const [dateApplied, setDateApplied] = useState(new Date(jobData.dateApplied));
  const [referral, setReferral] = useState(jobData.referral);
  const [referrerName, setReferrerName] = useState(jobData.referrerName || '');
  const [companyOptions, setCompanyOptions] = useState([]);
  // Add similar state variables for error handling as in the JobForm component

  useEffect(() => {
    // Fetch companies and set options in the state
    axios
      .get('http://localhost:5000/api/companies')
      .then((response) => setCompanyOptions(response.data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Similar validation and submission logic as in the JobForm component

    // Use axios.put for updating the job data
    axios
      .put(`http://localhost:5000/api/jobs/${jobId}`, {
        jobId,
        title,
        company,
        jobType,
        jobPostingUrl,
        dashboardUrl,
        jobPostingSource,
        dateApplied,
        referral,
        referrerName: referral ? referrerName : null,
      })
      .then((response) => {
        onUpdate(response.data);
        // Reset state after successful update
        setJobId('');
        setTitle('');
        setCompany('');
        setJobType('');
        setJobPostingUrl('');
        setDashboardUrl('');
        setJobPostingSource('');
        setDateApplied(null);
        setReferral(false);
        setReferrerName('');
      })
      .catch((error) => console.error('Error updating job:', error));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <Paper
          elevation={3}
          style={{
            padding: '30px',
            width: '800px',
            maxWidth: '100%',
            margin: 'auto',
          }}
        >
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={companyOptions}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Company"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  )}
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
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="SWE">SWE</MenuItem>
                    <MenuItem value="SDE">SDE</MenuItem>
                    <MenuItem value="Data Engineering">Data Engineering</MenuItem>
                    <MenuItem value="Automation">Automation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Posting URL"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={jobPostingUrl}
                  onChange={(e) => setJobPostingUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dashboard URL"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={dashboardUrl}
                  onChange={(e) => setDashboardUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="job-posting-source-label">Job Posting Source</InputLabel>
                  <Select
                    labelId="job-posting-source-label"
                    id="job-posting-source"
                    value={jobPostingSource}
                    onChange={(e) => setJobPostingSource(e.target.value)}
                    label="Job Posting Source"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Indeed">Indeed</MenuItem>
                    <MenuItem value="Built-In">Built-In</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'center' }}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <DatePicker
                    value={dateApplied}
                    onChange={(newValue) => setDateApplied(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Referrer Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Job
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default UpdateJob;
