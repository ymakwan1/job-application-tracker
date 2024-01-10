// src/components/JobForm.js
import React, { useState } from 'react';
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
  Box,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const JobForm = ({ onSubmit }) => {
  const [jobId, setJobId] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobPostingUrl, setJobPostingUrl] = useState('');
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [jobPostingSource, setJobPostingSource] = useState('');
  const [dateApplied, setDateApplied] = useState(null);
  const [referral, setReferral] = useState(false);
  const [referrerName, setReferrerName] = useState('');
  const [jobIdError, setJobIdError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [jobTypeError, setJobTypeError] = useState('');
  const [jobPostingUrlError, setJobPostingUrlError] = useState('');
  const [dashboardUrlError, setDashboardUrlError] = useState('');
  const [jobPostingSourceError, setJobPostingSourceError] = useState('');
  const [referrerNameError, setReferrerNameError] = useState('');
  const [dateAppliedError, setDateAppliedError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isURLValid = (url) => {
    // Regular expression for a valid URL
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbar(false);
  };

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
    setDateAppliedError('');

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

    if (!dateApplied) {
      setDateAppliedError('Date Applied is required');
      return;
    }

    if (referral && !referrerName.trim()) {
      setReferrerNameError('Referrer Name is required if referral is checked');
      return;
    }

    if (!isURLValid(jobPostingUrl)) {
      setJobPostingUrlError('Enter a valid Job Posting URL');
      return;
    }

    if (!isURLValid(dashboardUrl)) {
      setDashboardUrlError('Enter a valid Dashboard URL');
      return;
    }

    axios
      .post('http://127.0.0.1:5000/api/jobs', {
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
        onSubmit(response.data);
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
        setShowSuccess(true);

        // Reset success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setErrorSnackbar(true);
      });
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
                    <MenuItem value="HandShake">HandShake</MenuItem>
                  </Select>
                </FormControl>
                {jobPostingSourceError && (
                  <p style={{ color: 'red', margin: '5px 0 0', fontSize: '0.75rem' }}>
                    {jobPostingSourceError}
                  </p>
                )}
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
                        error={!!dateAppliedError}
                        helperText={dateAppliedError}
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

          {/* Success Snackbar */}
          <Snackbar
            open={showSuccess}
            autoHideDuration={5000}
            onClose={() => setShowSuccess(false)}
          >
            <CustomAlert onClose={() => setShowSuccess(false)} severity="success">
              Job added successfully!
            </CustomAlert>
          </Snackbar>

          {/* Error Snackbar */}
          <Snackbar
            open={errorSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseErrorSnackbar}
          >
            <MuiAlert onClose={handleCloseErrorSnackbar} severity="error" elevation={6} variant="filled">
              {errorMessage}
            </MuiAlert>
          </Snackbar>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default JobForm;
