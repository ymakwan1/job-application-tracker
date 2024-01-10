import React, { useState, useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import axios from "axios";
import Plot from "react-plotly.js";

const Counter = ({ label, value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const countingTimeout = setTimeout(() => {
      setCount(value);
    }, 500);

    return () => clearTimeout(countingTimeout);
  }, [value]);

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
  const [dailyJobApplications, setDailyJobApplications] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/analytics")
      .then((response) => {
        setTotalJobs(response.data.totalJobs);
        setTotalRejectedJobs(response.data.totalRejectedJobs);
        setTotalAcceptedJobs(response.data.totalAcceptedJobs);
        setTotalOAReceived(response.data.totalOAReceived);
        setTotalTechInterviewReceived(response.data.totalTechInterviewReceived);
        setDailyJobApplications(response.data.dailyJobApplications || []);
        console.log(response.data.dailyJobApplications)
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
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
          marginBottom: "20px", // Add margin to separate the two Paper components
        }}
      >
        <Typography variant="h5" gutterBottom>
          Analytics
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Counter label="Jobs Applied" value={totalJobs} />
          <Counter label="Rejected Jobs" value={totalRejectedJobs} />
          <Counter label="Accepted Jobs" value={totalAcceptedJobs} />
          <Counter label="OA Received" value={totalOAReceived} />
          <Counter label="Tech Interview" value={totalTechInterviewReceived} />
        </Box>
      </Paper>

      {/* Paper for Graph */}
      <Paper
        elevation={3}
        style={{
          padding: "30px",
          width: "1000px", // Set the width to 1000px
          maxWidth: "100%",
          margin: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Daily Job Applications
        </Typography>
        <Plot
          data={[
            {
              x: dailyJobApplications.map((entry) => entry.date),
              y: dailyJobApplications.map((entry) => entry.applications),
              type: "bar",
              marker: { color: "blue" },
            },
          ]}
          layout={{
            width: 900, // Set the width of the graph
            height: 400,
            title: "Daily Job Applications",
            xaxis: { title: "Date", type: "category" },
            yaxis: { title: "Applications" },
            margin: { t: 50, l: "auto", r: "auto", b: 50 }, // Center the graph by setting left and right margins to "auto"
            bargap: 0.1, // Adjust the gap between bars
            bargroupgap: 0.2, // Adjust the gap between bar groups
          }}
        />
      </Paper>
    </Box>
  );
};

export default Analytics;
