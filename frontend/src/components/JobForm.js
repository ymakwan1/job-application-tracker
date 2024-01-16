import React, { useCallback, useState } from 'react';
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
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MuiAlert from '@mui/material/Alert';
import apiService from '../apiService';

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const JobForm = ({ onSubmit }) => {
  const theme = useTheme();

  const [formState, setFormState] = useState({
    jobId : '',
    title : '',
    company : '',
    jobType : '',
    jobPostingUrl : '',
    dashboardUrl : '',
    jobPostingSource : '',
    dateApplied : null,
    referral : false,
    referrerName : '',
  });

  const handleInputChange = useCallback((field, value) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [field] : value,
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

  // const handleCloseErrorSnackbar = () => {
  //   setErrorSnackbar(false);
  // };

  const handleSubmit = useCallback((e) => {
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

    apiService.post('/jobs', {
        ...formState,
        referrerName: formState.referral ? formState.referrerName : null,
      })
      .then((response) => {
        onSubmit(response.data);
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
        });
        setShowSuccess(true);

        // Reset success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
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
        });
      });
  }, [formState, onSubmit]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Paper
          elevation={3}
          style={{
            padding: '30px',
            width: '800px',
            maxWidth: '100%',
            margin: 'auto',
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
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
                  margin="normal"
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
                  fullWidth
                  margin="normal"
                  value={formState.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
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
                    value={formState.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    label="Job Type"
                    error={!!jobTypeError}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200, 
                          overflowY: 'auto', 
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="SWE">SWE</MenuItem>
                    <MenuItem value="SDE">SDE</MenuItem>
                    <MenuItem value="FullStack">Full Stack</MenuItem>
                    <MenuItem value="FrontEnd">Frontend</MenuItem>
                    <MenuItem value="BackEndDeveloper">Backend</MenuItem>
                    <MenuItem value="Cloud">Cloud</MenuItem>
                    <MenuItem value="Data Engineering">Data Engineering</MenuItem>
                    <MenuItem value="DevOps">DevOps Engineer</MenuItem>
                    <MenuItem value="Automation">Automation</MenuItem>
                    <MenuItem value="MobileAppDeveloper">Mobile App Developer</MenuItem>
                    <MenuItem value="DatabaseAdministrator">Database Administrator</MenuItem>
                    <MenuItem value="MLOps">ML Ops</MenuItem>
                    <MenuItem value="AIEngineer">AI Engineer</MenuItem>
                    <MenuItem value="MLEngineer">ML Engineer</MenuItem>
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
                  fullWidth
                  margin="normal"
                  value={formState.dashboardUrl}
                  onChange={(e) => handleInputChange('dashboardUrl', e.target.value)}
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
                    value={formState.jobPostingSource}
                    onChange={(e) => handleInputChange('jobPostingSource', e.target.value)}
                    label="Job Posting Source"
                    error={!!jobPostingSourceError}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200, 
                          overflowY: 'auto', 
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Company Website">Company Website</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Indeed">Indeed</MenuItem>
                    <MenuItem value="Built-In">Built-In</MenuItem>
                    <MenuItem value="HandShake">HandShake</MenuItem>
                    <MenuItem value="Monster">Monster</MenuItem>
                    <MenuItem value="CareerBuilder">CareerBuilder</MenuItem>
                    <MenuItem value="SimplyHired">SimplyHired</MenuItem>
                    <MenuItem value="Dice">Dice</MenuItem>
                    <MenuItem value="ZipRecruiter">ZipRecruiter</MenuItem>
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
                    value={formState.dateApplied}
                    onChange={(newValue) => handleInputChange('dateApplied', newValue)}
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
                    margin="normal"
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