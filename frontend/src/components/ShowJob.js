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
  Snackbar, 
  FormControl, 
  Select, 
  MenuItem, 
  InputAdornment, 
  TextField,
  useTheme,
  CircularProgress,
  IconButton
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../apiService';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 



const ShowJob = () => {
  const theme = useTheme(); 
  const [jobs, setJobs] = useState([]);
  const [deletedJobId, setDeletedJobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get('/show_jobs');
        const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date_applied) - new Date(a.date_applied));
        setJobs(sortedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Error fetching jobs. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [deletedJobId]);

  const handleDelete = async (jobId) => {
    try {
      await apiService.delete(`/delete_job/${jobId}`);
      setDeletedJobId(jobId);
      setShowSuccess(true);
      setError(null);
      setTimeout(() => {
        setShowSuccess(false);
        setDeletedJobId(null);
      }, 5000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Error deleting job. Please try again.');
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await apiService.put(`/update_status/${jobId}`, { newStatus });
      const response = await apiService.get('/show_jobs');
      const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date_applied) - new Date(a.date_applied));
      setJobs(sortedJobs);
      setError(null);
      setStatusChangeSuccess(jobId);
      setTimeout(() => {
        setStatusChangeSuccess(null);
      }, 5000);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status. Please try again.');
    }
  };

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);

    try {
      if (searchTerm.trim() === '') {
        const response = await apiService.get('/show_jobs');
        const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date_applied) - new Date(a.date_applied));
        setJobs(sortedJobs);
      } else {
        const filteredJobs = jobs.filter((job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setJobs(filteredJobs);
      }
      setError(null); 
    } catch (error) {
      console.error('Error fetching or filtering jobs:', error);
      setError('Error fetching or filtering jobs. Please try again.');
    }
  };

  const handleCloseError = () => {
    setError(null); 
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) :
        jobs.length === 0 ? (
          <Typography variant="body1" style={{ color: theme.palette.text.primary }}>
            {searchTerm.trim() === ''
              ? 'No jobs available.'
              : 'No jobs match the search criteria.'}
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={0}>
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
                  <TableCell style={{ color: theme.palette.text.primary }}>Delete / Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.job_id}>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_id}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.title}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.company}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_type}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{new Date(job.date_applied).toLocaleDateString()}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_posting_source}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <a href={job.dashboard_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: theme.palette.info.main }}>
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
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(job.job_id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/job_details/${job.job_id}`}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)}>
          <Alert onClose={() => setShowSuccess(false)} severity="success">
            {`Job with Job ID ${deletedJobId} deleted successfully`}
          </Alert>
        </Snackbar>
        <Snackbar open={statusChangeSuccess !== null} autoHideDuration={5000} onClose={() => setStatusChangeSuccess(null)}>
          <Alert onClose={() => setStatusChangeSuccess(false)} severity="success">
            {`Application Status for Job ID ${statusChangeSuccess} changed`}
          </Alert>
        </Snackbar>
        <Snackbar open={error !== null} autoHideDuration={5000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ShowJob;