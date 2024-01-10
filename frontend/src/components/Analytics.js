import React, { useState, useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import axios from "axios";

const Analytics = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRejectedJobs, setTotalRejectedJobs] = useState(0);
  const [totalAcceptedJobs, setTotalAcceptedJobs] = useState(0);
  const [totalOAReceived, setTotalOAReceived] = useState(0);
  const [totalTechInterviewReceived, setTotalTechInterviewReceived] = useState(0);

  useEffect(() => {
    // Fetch data to get the analytics data
    axios
      .get("http://127.0.0.1:5000/api/analytics")
      .then((response) => {
        // Simulate counting effect after 500ms delay
        const countingTimeout = setTimeout(() => {
          // Set the final values after the delay
          // You can adjust the duration and easing function as needed
          setTotalJobs(response.data.totalJobs);
          setTotalRejectedJobs(response.data.totalRejectedJobs);
          setTotalAcceptedJobs(response.data.totalAcceptedJobs);
          setTotalOAReceived(response.data.totalOAReceived);
          setTotalAcceptedJobs(response.data.totalAcceptedJobs);
          setTotalTechInterviewReceived(response.data.totalTechInterviewReceived);
        }, 500);

        // Clear the timeout on component unmount to avoid memory leaks
        return () => clearTimeout(countingTimeout);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
      bgcolor="#f0f0f0"
    >
      <Paper
        elevation={3}
        style={{
          padding: "30px",
          width: "600px",
          maxWidth: "100%",
          margin: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Analytics
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
        >
          <Box textAlign="center" mb={2}>
            <Typography variant="body1" fontSize="24px">
              Jobs Applied
            </Typography>
            <Typography variant="body1" fontSize="32px" fontWeight="bold">
              {totalJobs}
            </Typography>
          </Box>
          <Box textAlign="center" mb={2}>
            <Typography variant="body1" fontSize="24px">
              Rejected Jobs
            </Typography>
            <Typography variant="body1" fontSize="32px" fontWeight="bold">
              {totalRejectedJobs}
            </Typography>
          </Box>
          <Box textAlign="center" mb={2}>
            <Typography variant="body1" fontSize="24px">
              Accepted Jobs
            </Typography>
            <Typography variant="body1" fontSize="32px" fontWeight="bold">
              {totalAcceptedJobs}
            </Typography>
          </Box>
          <Box textAlign="center" mb={2}>
            <Typography variant="body1" fontSize="24px">
              OA Received
            </Typography>
            <Typography variant="body1" fontSize="32px" fontWeight="bold">
              {totalOAReceived}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body1" fontSize="24px">
              Tech Interview
            </Typography>
            <Typography variant="body1" fontSize="32px" fontWeight="bold">
              {totalTechInterviewReceived}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;