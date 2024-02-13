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
  Grid,
  CircularProgress,
  IconButton,
  InputLabel,
  Tooltip,
  TablePagination
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../apiService';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 
import { applicationStatusOptions } from '../constants';

const ShowJob = () => {
  const theme = useTheme(); 
  const [jobs, setJobs] = useState([]);
  const [deletedJobId, setDeletedJobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [statusChangeSuccess, setStatusChangeSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get(`/show_jobs?search=${searchTerm}&status=${statusFilter}`);
        const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date) - new Date(a.date));
        setJobs(sortedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Error fetching jobs. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [deletedJobId, searchTerm, statusFilter]);

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
      const response = await apiService.get(`/show_jobs?search=${searchTerm}&status=${statusFilter}`);
      const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date) - new Date(a.date));
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
      const response = await apiService.get(`/show_jobs?search=${searchTerm}&status=${statusFilter}`);
      const sortedJobs = [...response.data.jobs].sort((a, b) => new Date(b.date) - new Date(a.date));
      setJobs(sortedJobs);
      setError(null);
    } catch (error) {
      console.error('Error fetching or filtering jobs:', error);
      setError('Error fetching or filtering jobs. Please try again.');
    }
  };
  

  const handleCloseError = () => {
    setError(null); 
  };

  const handleStatusFilterChange = (event) => { 
    setStatusFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          width: '100%',
          maxWidth: '1400px',
          margin: 'auto',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom>
          List of Jobs Applied
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}> 
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
          </Grid>
          <Grid item xs={4}> 
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="status-filter" style={{ marginBottom: '8px' }}>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Filter by Status"
                inputProps={{
                  id: 'status-filter',
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
        </Grid>
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
          <>
          <TableContainer component={Paper} elevation={0} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell style={{ color: theme.palette.text.primary }}>Job ID</TableCell> */}
                  <TableCell style={{ color: theme.palette.text.primary }}>Title</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Company</TableCell>
                  {/* <TableCell style={{ color: theme.palette.text.primary }}>Job Type</TableCell> */}
                  <TableCell style={{ color: theme.palette.text.primary }}>Date</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Source</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Dashboard</TableCell>
                  {/* <TableCell style={{ color: theme.palette.text.primary }}>Referral</TableCell> */}
                  <TableCell style={{ color: theme.palette.text.primary }}>Application Status</TableCell>
                  <TableCell style={{ color: theme.palette.text.primary }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {(rowsPerPage > 0
                    ? jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : jobs
                  ).map((job) =>  (
                  <TableRow key={job.job_id}>
                    {/* <TableCell style={{ color: theme.palette.text.primary }}>{job.job_id}</TableCell> */}
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.title}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.company}</TableCell>
                    {/* <TableCell style={{ color: theme.palette.text.primary }}>{job.job_type}</TableCell> */}
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.date}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>{job.job_posting_source}</TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <a href={job.dashboard_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: theme.palette.info.main }}>
                        Dashboard
                      </a>
                    </TableCell>
                    {/* <TableCell style={{ color: theme.palette.text.primary }}>{job.referral ? 'Yes' : 'No'}</TableCell> */}
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <FormControl variant="outlined" size="small">
                        <Select
                          labelId={`status-label-${job.job_id}`}
                          id={`status-${job.job_id}`}
                          value={job.application_status}
                          onChange={(e) => handleStatusChange(job.job_id, e.target.value)}
                        >
                          {applicationStatusOptions.map((status, index) => (
                            <MenuItem key={index} value={status}>
                                {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ color: theme.palette.text.primary }}>
                      <Tooltip title="Delete">
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(job.job_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/job_details/${job.job_id}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={jobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </>
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