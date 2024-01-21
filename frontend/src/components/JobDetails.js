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
    Checkbox,
    FormControlLabel, useTheme, InputLabel } from "@mui/material";
import apiService from "../apiService";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs'

const JobDetails = () => {
    const theme = useTheme();
    const { job_id } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [appliedDate, setAppliedDate] = useState(null);
    
    useEffect(() => {
        apiService.get(`/job_details/${job_id}`)
        .then((response) => {
            // console.log(response.data.jobDetails);
            // console.log(format(new Date(response.data.jobDetails.date_applied.split("T")[0]).toLocaleDateString(), 'MM/dd/yyyy'))
            setJobDetails(response.data.jobDetails);
            setAppliedDate(dayjs(response.data.jobDetails.date_applied));
        })
        .catch((error) => console.error('Error fetching job details:', error));
    }, [job_id]);

    if (!jobDetails) {
        return <p>Loading ...</p>
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
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job ID</InputLabel>
                            <TextField 
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.job_id}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Title</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.title}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Company</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.company}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Type</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                            <Select 
                                value={jobDetails.job_type}
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Posting URL</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.job_posting_url}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Dashboard URL</InputLabel>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={jobDetails.dashboard_url}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Job Posting Source</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                                <Select
                                    value={jobDetails.job_posting_source}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                overflow: 'auto',
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
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column' }}>
                            <InputLabel>Date Applied</InputLabel>
                            <FormControl variant="outlined" fullWidth margin="normal">
                            <DatePicker
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        format="MM-dd-yyyy"
                                        value={dayjs(appliedDate).format('MM-DD-YYYY')}
                                    />
                                )}
                                value={appliedDate}
                                
                            />
                            </FormControl>
                        </Grid>
                        {jobDetails.referral && (
                            <Grid item xs={12} sm={6}>
                                <InputLabel>Referrer Name</InputLabel>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={jobDetails.referrer_name}
                                />
                            </Grid>
                        )}
                        <Grid xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Job Details
                            </Button>
                        </Grid>
                    </Grid>
                </form>

            </Paper>
        </Box>
        </LocalizationProvider>
    );
};
export default JobDetails