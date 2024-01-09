import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Snackbar, FormControl, Select, MenuItem, InputAdornment, TextField,InputLabel } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const ShowJob = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [deletedJobId, setDeletedJobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/show_jobs')
      .then((response) => {
        if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);
        } else {
          console.error('Invalid data structure received:', response.data);
        }
      })
      .catch((error) => console.error('Error fetching jobs:', error));
  }, [deletedJobId]);

  const handleDelete = (jobId) => {
    axios
      .delete(`http://127.0.0.1:5000/api/delete_job/${jobId}`)
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
    axios
      .put(`http://127.0.0.1:5000/api/update_status/${jobId}`, { newStatus })
      .then(() => {
        axios
          .get('http://127.0.0.1:5000/api/show_jobs')
          .then((response) => {
            if (Array.isArray(response.data.jobs)) {
              setJobs(response.data.jobs);
              setFilteredJobs(response.data.jobs);
            } else {
              console.error('Invalid data structure received:', response.data);
            }
          })
          .catch((error) => console.error('Error fetching jobs:', error));
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    filterJobs(searchTerm, selectedFilter);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setSelectedFilter(newFilter);
    filterJobs(searchTerm, newFilter);
  };

  const filterJobs = (searchTerm, filter) => {
    const filtered = jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const companyMatch = job.company.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === 'all') {
        return titleMatch || companyMatch;
      } else {
        return (titleMatch || companyMatch) && job.application_status === filter;
      }
    });

    setFilteredJobs(filtered);
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
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <Paper
        elevation={3}
        style={{
          padding: '30px',
          width: '1400px',
          maxWidth: '100%',
          margin: 'auto',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" gutterBottom>
          List of Jobs Applied
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between" 
          alignItems="center"
          width="100%"
        >
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
                <i className="fas fa-search"></i>
              </InputAdornment>
            ),
          }}
          style={{ width: '700px' }}
        />
        <FormControl variant="outlined" margin="normal" style={{ minWidth: '250px' }}>
        <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            label="Filter by Status"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="OA Received">OA Received</MenuItem>
            <MenuItem value="Tech Interview">Tech Interview</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
          </Select>
        </FormControl>
        </Box>
        {filteredJobs.length === 0 ? (
          <Typography variant="body1">No jobs match the search criteria.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Job Type</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Dashboard</TableCell>
                  <TableCell>Referral</TableCell>
                  <TableCell>Application Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.job_id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{new Date(job.date_applied).toLocaleDateString()}</TableCell>
                    <TableCell>{job.job_posting_source}</TableCell>
                    <TableCell>
                      <a href={job.dashboard_url} target="_blank" rel="noopener noreferrer">
                        Dashboard
                      </a>
                    </TableCell>
                    <TableCell>{job.referral ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
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
                    <TableCell>
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
