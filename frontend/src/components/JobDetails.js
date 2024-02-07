import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  useTheme,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import apiService from "../apiService";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { jobTitles, platformTypes, applicationStatusOptions } from "../constants";
import dayjs from 'dayjs'

const JobDetails = () => {
  const theme = useTheme();
  const { job_id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [appliedDate, setAppliedDate] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await apiService.get(`/job_details/${job_id}`);
        setJobDetails(response.data.jobDetails);
        setAppliedDate(dayjs(response.data.jobDetails.date));
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [job_id]);

  const updateJobDetails = async () => {
    try {
      if (jobDetails) {
        await apiService.put(`/update_job/${job_id}`, {
          jobId: jobDetails.job_id,
          title: jobDetails.title,
          company: jobDetails.company,
          job_type: jobDetails.job_type,
          jobPostingUrl: jobDetails.job_posting_url,
          dashboardUrl: jobDetails.dashboard_url,
          job_posting_source: jobDetails.job_posting_source,
          date: dayjs(appliedDate).format('YYYY-MM-DD'),
          referral: jobDetails.referral,
          referrer_name: jobDetails.referrer_name,
          application_status: jobDetails.application_status
        });
        console.log('Job details updated successfully');
        setSuccessSnackbarOpen(true);
        const response = await apiService.get(`/job_details/${jobDetails.job_id}`);
        setJobDetails(response.data.jobDetails);
        setAppliedDate(dayjs(response.data.jobDetails.date));
      }
    } catch (error) {
      console.error('Error updating job details:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateJobDetails();
    history(`/job_details/${jobDetails.job_id}`);
  };
  if (!jobDetails) {
    return <p>Loading ...</p>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
        style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}
      >
        <Box maxWidth="800px" width="100%">
          <Paper
            elevation={3}
            style={{
              padding: '30px',
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Job Details for Job ID: {job_id}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      label="Job ID"
                      value={jobDetails.job_id || ''}
                      onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_id: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      label="Title"
                      value={jobDetails.title}
                      onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, title: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      label="Company"
                      value={jobDetails.company}
                      onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, company: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select
                        label="Job Type"
                        defaultValue={jobDetails.job_type}
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
                        {jobTitles.map((title, index) => (
                          <MenuItem key={index} value={title}>
                              {title}
                          </MenuItem>
                      ))}
                    </TextField>
                  {/* <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                    <Select 
                        value={jobDetails.job_type}
                        labelId="job-type-label"
                        onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_type: e.target.value }))}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                      {jobTitles.map((title, index) => (
                          <MenuItem key={index} value={title}>
                              {title}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        label="Job Posting URL"
                        value={jobDetails.job_posting_url}
                        onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_posting_url: e.target.value }))}
                    />
                </Grid>
                {/* Additional grid items for other fields */}
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Update Job Details
                </Button>
              </Grid>
            </form>
            <Snackbar
              open={successSnackbarOpen}
              autoHideDuration={5000}
              onClose={handleSnackbarClose}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity="success"
              >
                Job details updated successfully!
              </MuiAlert>
            </Snackbar>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
export default JobDetails;
