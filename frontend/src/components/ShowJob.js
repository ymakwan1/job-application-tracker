import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Snackbar, 
  FormControl, 
  Select, 
  MenuItem, 
  InputAdornment, 
  TextField,
  useTheme,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../apiService';
import { Link } from 'react-router-dom';

const ShowJob = () => {
  const theme = useTheme(); 
  const [jobs, setJobs] = useState([]);
  const [deletedJobId, setDeletedJobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiService.get('/show_jobs')
      .then((response) => {
        setJobs(response.data.jobs);
      })
      .catch((error) => console.error('Error fetching jobs:', error));
  }, [deletedJobId]);

  const handleDelete = (jobId) => {
    apiService.delete(`/delete_job/${jobId}`)
      .then(() => {
        setDeletedJobId(jobId);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setDeletedJobId(null);
        }, 5000);
      })
      .catch((error) => console.error('Error deleting job:', error));
  };

  const handleStatusChange = (jobId, newStatus) => {
    apiService.put(`/update_status/${jobId}`, { newStatus })
      .then(() => {
        apiService.get('/show_jobs')
          .then((response) => {
            setJobs(response.data.jobs);
          })
          .catch((error) => console.error('Error fetching jobs:', error));
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  
    if (searchTerm.trim() === '') {
      // If the search term is empty, reset the jobs to the original list
      apiService.get('/show_jobs')
        .then((response) => {
          setJobs(response.data.jobs);
        })
        .catch((error) => console.error('Error fetching jobs:', error));
    } else {
      // Filter jobs based on the search term
      const filteredJobs = jobs.filter((job) => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setJobs(filteredJobs);
    }
  };
  

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
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
          width: '1400px',
          maxWidth: '100%',
          margin: 'auto',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom>
          List of Jobs Applied
        </Typography>
        <TextField
          label="Search Jobs"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="fas fa-search" style={{ color: theme.palette.text.secondary }}></i>
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: '20px' }}
        />
        {jobs.length === 0 ? (
          <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
            {searchTerm.trim() === ''
              ? 'No jobs available.'
              : 'No jobs match the search criteria.'}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: theme.palette.text.primary }}>Job ID</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Title</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Company</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Job Type</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Applied On</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Source</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Dashboard</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Referral</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Application Status</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.job_id}>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <Link to={`/job_details/${job.job_id}`} style={{ textDecoration: 'none' }}>
                        {job.job_id}
                      </Link>
                    </TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.title}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.company}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_type}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{new Date(job.date_applied).toLocaleDateString()}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_posting_source}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <a href={job.dashboard_url} target="_blank" rel="noopener noreferrer">
                        Dashboard
                      </a>
                    </TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.referral ? 'Yes' : 'No'}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <FormControl variant="outlined">
                        <Select
                          labelId={`status-label-${job.job_id}`}
                          id={`status-${job.job_id}`}
                          value={job.application_status}
                          onChange={(e) => handleStatusChange(job.job_id, e.target.value)}
                        >
                          <MenuItem value="Applied">Applied</MenuItem>
                          <MenuItem value="OA Received">OA Received</MenuItem>
                          <MenuItem value="Tech Interview">Tech Interview</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                          <MenuItem value="Accepted">Accepted</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(job.job_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)}>
          <Alert onClose={() => setShowSuccess(false)} severity="success">
            {`Job with job id ${deletedJobId} deleted successfully`}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ShowJob;