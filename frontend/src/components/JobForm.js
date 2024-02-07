import React, { useCallback, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  useTheme,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import apiService from '../apiService';
import { jobTitles, platformTypes } from '../constants';

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const JobForm = ({ onSubmit }) => {
  const theme = useTheme();

  const [formState, setFormState] = useState({
    jobId: '',
    title: '',
    company: '',
    jobType: '',
    jobPostingUrl: '',
    dashboardUrl: '',
    jobPostingSource: '',
    dateApplied: dayjs(),
    referral: false,
    referrerName: '',
    // jobLocation: '',
    // applicationStatus: ''
  });

  const handleInputChange = useCallback((field, value) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [field]: value,
    }));
  }, []);

  const handleCloseErrorSnackbar = useCallback(() => {
    setErrorSnackbar(false);
  }, []);

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

  const handleSubmit = useCallback(async (e) => {
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

    try {
      if (!formState.jobId.trim()) {
        setJobIdError('Job ID is required');
        return;
      }

      if (!formState.title.trim()) {
        setTitleError('Job Title is required');
        return;
      }

      if (!formState.company.trim()) {
        setCompanyError('Company Name is required');
        return;
      }

      if (!formState.jobType) {
        setJobTypeError('Job Type is required');
        return;
      }

      if (!formState.jobPostingUrl.trim()) {
        setJobPostingUrlError('Job Posting URL is required');
        return;
      }

      if (!formState.dashboardUrl.trim()) {
        setDashboardUrlError('Dashboard URL is required');
        return;
      }

      if (!formState.jobPostingSource) {
        setJobPostingSourceError('Job Posting Source is required');
        return;
      }

      if (!formState.dateApplied) {
        setDateAppliedError('Date Applied is required');
        return;
      }

      if (formState.referral && !formState.referrerName.trim()) {
        setReferrerNameError('Referrer Name is required if referral is checked');
        return;
      }

      if (!isURLValid(formState.jobPostingUrl)) {
        setJobPostingUrlError('Enter a valid Job Posting URL');
        return;
      }

      if (!isURLValid(formState.dashboardUrl)) {
        setDashboardUrlError('Enter a valid Dashboard URL');
        return;
      }

      const response = await apiService.post('/jobs', {
        ...formState,
        referrerName: formState.referral ? formState.referrerName : null,
      });

      onSubmit(response.data);

      setFormState({
        jobId: '',
        title: '',
        company: '',
        jobType: '',
        jobPostingUrl: '',
        dashboardUrl: '',
        jobPostingSource: '',
        dateApplied: dayjs(),
        referral: false,
        referrerName: '',
        // jobLocation: '',
        // applicationStatus: ''
      });

      setShowSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
      setErrorSnackbar(true);

      setFormState({
        jobId: '',
        title: '',
        company: '',
        jobType: '',
        jobPostingUrl: '',
        dashboardUrl: '',
        jobPostingSource: '',
        dateApplied: null,
        referral: false,
        referrerName: '',
        // jobLocation: '',
        // applicationStatus: ''
      });
    }
  }, [formState, onSubmit]);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        width="100%"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Paper
          elevation={3}
          style={{
            padding: '60px',
            maxWidth: '1100px',
            margin: 'auto',
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography align='center' gutterBottom variant='h5' >
            Job Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job ID"
                  variant="outlined"
                  fullWidth
                  value={formState.jobId}
                  onChange={(e) => handleInputChange('jobId', e.target.value)}
                  error={!!jobIdError}
                  helperText={jobIdError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  value={formState.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={!!titleError}
                  helperText={titleError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company"
                  variant="outlined"
                  margin='normal'
                  fullWidth
                  value={formState.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  error={!!companyError}
                  helperText={companyError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select
                        label="Job Type"
                        value={formState.jobType}
                        onChange={(e) => handleInputChange('jobType', e.target.value)}
                        error={!!jobTypeError}
                        SelectProps={{ 
                          MenuProps: {
                              PaperProps: {
                                  style: {
                                      maxHeight: 200,
                                      overflowY: 'auto',
                                  }
                              }
                          }
                      }}
                    >
                      {jobTitles.map((title, index) =>
                      <MenuItem key={index} value={title}>{title}</MenuItem>
                    )}
                  </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Posting URL"
                  variant="outlined"
                  margin='normal'
                  fullWidth
                  value={formState.jobPostingUrl}
                  onChange={(e) => handleInputChange('jobPostingUrl', e.target.value)}
                  error={!!jobPostingUrlError}
                  helperText={jobPostingUrlError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dashboard URL"
                  variant="outlined"
                  margin='normal'
                  fullWidth
                  value={formState.dashboardUrl}
                  onChange={(e) => handleInputChange('dashboardUrl', e.target.value)}
                  error={!!dashboardUrlError}
                  helperText={dashboardUrlError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <TextField
                    value={formState.jobPostingSource}
                    onChange={(e) => handleInputChange('jobPostingSource', e.target.value)}
                    label="Job Posting Source"
                    fullWidth
                    margin='normal'
                    error={!!jobPostingSourceError}
                    SelectProps={{ 
                      MenuProps: {
                          PaperProps: {
                              style: {
                                  maxHeight: 200,
                                  overflowY: 'auto',
                              }
                          }
                      }
                  }}
                  >
                    {platformTypes.map((title, index) =>
                      <MenuItem key={index} value={title}>{title}</MenuItem>
                    )}
                  </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" margin='normal' fullWidth>
                  <DatePicker
                    label="Date"
                    value={formState.dateApplied}
                    onChange={(newValue) => handleInputChange('dateApplied', newValue)}
                    textField={(params) =>
                      <TextField
                        {...params}
                        variant="outlined"
                        error={!!dateAppliedError}
                        helperText={dateAppliedError}
                        fullWidth
                      />
                    }
                  />
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formState.jobLocation}
                    onChange={(e) => handleInputChange('jobLocation', e.target.value)}
                    label="Location"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200, 
                          overflowY: 'auto', 
                        },
                      },
                    }}
                  >
                    {usStates.map((state, index) =>
                      <MenuItem key={index} value={state}>{state}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Application Status</InputLabel>
                  <Select
                    value={formState.applicationStatus}
                    onChange={(e) => handleInputChange('applicationStatus', e.target.value)}
                    label="Application Status"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200, 
                          overflowY: 'auto', 
                        },
                      },
                    }}
                  >
                    {applicationStatusOptions.map((status, index) =>
                      <MenuItem key={index} value={status}>{status}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formState.referral}
                      onChange={(e) => handleInputChange('referral', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Referral"
                />
              </Grid>
              {formState.referral && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Referrer Name"
                    variant="outlined"
                    fullWidth
                    value={formState.referrerName}
                    onChange={(e) => handleInputChange('referrerName', e.target.value)}
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
          <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)}>
            <CustomAlert onClose={() => setShowSuccess(false)} severity="success">
              Job added successfully!
            </CustomAlert>
          </Snackbar>

          {/* Error Snackbar */}
          <Snackbar open={errorSnackbar} autoHideDuration={5000} onClose={handleCloseErrorSnackbar}>
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
