import React, {useState, useEffect} from "react";
import {Typography,
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
            console.log(jobDetails)
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
        style={{ backgroundColor: theme.palette.background.default }}
        >
            
            <Paper
                elevation={3}
                style={
                    {
                        padding: '30px',
                        width: '800px',
                        maxWidth: '100%',
                        margin: 'auto',
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.background.paper,
                    }
                }
            >
                <Typography variant="h6" gutterBottom align="center">
                Job Details for Job ID: {job_id}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job ID</InputLabel>
                            <TextField 
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.job_id || ''}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_id: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Title</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.title}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, title: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Company</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.company}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, company: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Type</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <Select 
                                    value={jobDetails.job_type}
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Posting URL</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.job_posting_url}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_posting_url: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Dashboard URL</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.dashboard_url}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, dashboard_url: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Posting Source</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <Select
                                    value={jobDetails.job_posting_source}
                                    onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, job_posting_source: e.target.value }))}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                overflow: 'auto',
                                            },
                                        },
                                    }}
                                >
                                    {platformTypes.map((title, index) =>
                                        <MenuItem key={index} value={title}>
                                            {title}
                                        </MenuItem>
                                    )};
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column' }}>
                            <InputLabel>Date Applied</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                            <DatePicker
                                textField={(props) => (
                                    <TextField
                                        {...props}
                                        variant="outlined"
                                        format="MM-dd-yyyy"
                                        value={dayjs(appliedDate).format('MM-DD-YYYY')}
                                    />
                                )}
                                value={appliedDate}
                                onChange={(date) => setAppliedDate(date)}
                            />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                        <InputLabel>Application Status</InputLabel>
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <Select
                                        value={jobDetails.application_status}
                                        onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, application_status: e.target.value }))}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                    overflow: 'auto',
                                                },
                                            },
                                        }}
                                    >
                                        {applicationStatusOptions.map((status, index) => (
                                            <MenuItem key={index} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={jobDetails.referral}
                                        onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, referral: e.target.checked }))}
                                        color="primary"
                                    />
                                }
                                label="Referral"
                            />
                        </Grid>
                        {jobDetails.referral && (
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Referrer Name</InputLabel>
                                <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.referrer_name}
                                onChange={(e) => setJobDetails((prevJobDetails) => ({ ...prevJobDetails, referrer_name: e.target.value }))}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Job Details
                            </Button>
                        </Grid>
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
        </LocalizationProvider>
    );
};
export default JobDetails