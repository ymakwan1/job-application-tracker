import React, { useState, useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import axios from "axios";

const Counter = ({ label, value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate counting effect after 500ms delay
    const countingTimeout = setTimeout(() => {
      // Set the final value after the delay
      // You can adjust the duration and easing function as needed
      setCount(value);
    }, 500);

    // Clear the timeout on component unmount to avoid memory leaks
    return () => clearTimeout(countingTimeout);
  }, [value]); // Run the effect whenever the value changes

  return (
    <Box textAlign="center" mb={2}>
      <Typography variant="body1" fontSize="24px">
        {label}
      </Typography>
      <Typography variant="body1" fontSize="32px" fontWeight="bold">
        {count}
      </Typography>
    </Box>
  );
};

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
        // Set the final values
        setTotalJobs(response.data.totalJobs);
        setTotalRejectedJobs(response.data.totalRejectedJobs);
        setTotalAcceptedJobs(response.data.totalAcceptedJobs);
        setTotalOAReceived(response.data.totalOAReceived);
        setTotalTechInterviewReceived(response.data.totalTechInterviewReceived);
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
          width: "900px",
          maxWidth: "100%",
          margin: "auto",
          marginTop: "40px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h1" gutterBottom>
          Analytics
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row" // Set flexDirection to "row"
        >
          <Counter label="Jobs Applied" value={totalJobs} />
          <Counter label="Rejected Jobs" value={totalRejectedJobs} />
          <Counter label="Accepted Jobs" value={totalAcceptedJobs} />
          <Counter label="OA Received" value={totalOAReceived} />
          <Counter label="Tech Interview" value={totalTechInterviewReceived} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
