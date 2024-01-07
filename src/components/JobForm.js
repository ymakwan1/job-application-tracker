// src/components/JobForm.js
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
import axios from 'axios';

const JobForm = ({ onSubmit }) => {
  const [jobId, setJobId] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobPostingUrl, setJobPostingUrl] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [jobPostingSource, setJobPostingSource] = useState('');
  const [referral, setReferral] = useState(false);
  const [referrerName, setReferrerName] = useState('');
  const [companyOptions, setCompanyOptions] = useState([]);
  const [jobIdError, setJobIdError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [jobTypeError, setJobTypeError] = useState('');
  const [jobPostingUrlError, setJobPostingUrlError] = useState('');
  const [dashboardUrlError, setDashboardUrlError] = useState('');
  const [jobPostingSourceError, setJobPostingSourceError] = useState('');
  const [referrerNameError, setReferrerNameError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/companies')
      .then((response) => setCompanyOptions(response.data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setJobIdError('');
    setTitleError('');
    setCompanyError('');
    setJobTypeError('');
    setJobPostingUrlError('');
    setDashboardUrlError('');
    setJobPostingSourceError('');
    setReferrerNameError('');

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

    if (!jobPostingUrl.trim()) {
      setJobPostingUrlError('Job Posting URL is required');
      return;
    }

    if (!dashboardUrl.trim()) {
      setDashboardUrlError('Dashboard URL is required');
      return;
    }

    if (!jobPostingSource) {
      setJobPostingSourceError('Job Posting Source is required');
      return;
    }

    if (referral && !referrerName.trim()) {
      setReferrerNameError('Referrer Name is required if referral is checked');
      return;
    }

    axios
      .post('http://localhost:5000/api/jobs', {
        jobId,
        title,
        company,
        jobType,
        jobPostingUrl,
        dashboardUrl,
        jobPostingSource,
        referral,
        referrerName: referral ? referrerName : null,
      })
      .then((response) => {
        onSubmit(response.data);
        setJobId('');
        setTitle('');
        setCompany('');
        setJobType('');
        setJobPostingUrl('');
        setDashboardUrl('');
        setJobPostingSource('');
        setReferral(false);
        setReferrerName('');
      })
      .catch((error) => console.error('Error adding job:', error));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
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
                    error={!!companyError}
                    helperText={companyError}
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
                <p style={{ color: 'red', margin: '5px 0 0', fontSize: '0.75rem' }}>
                  {jobTypeError}
                </p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Posting URL"
                variant="outlined"
                fullWidth
                margin="normal"
                value={jobPostingUrl}
                onChange={(e) => setJobPostingUrl(e.target.value)}
                error={!!jobPostingUrlError}
                helperText={jobPostingUrlError}
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
                error={!!dashboardUrlError}
                helperText={dashboardUrlError}
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
                  error={!!jobPostingSourceError}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                  <MenuItem value="Indeed">Indeed</MenuItem>
                  <MenuItem value="Built-In">Built-In</MenuItem>
                </Select>
              </FormControl>
              {jobPostingSourceError && (
                <p style={{ color: 'red', margin: '5px 0 0', fontSize: '0.75rem' }}>
                  {jobPostingSourceError}
                </p>
              )}
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
    </Box>
  );
};

export default JobForm;
