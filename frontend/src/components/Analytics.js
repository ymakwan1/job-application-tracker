import React, { useState, useEffect } from "react";
import { Typography, Paper, Box, useTheme } from "@mui/material";
import Plot from "react-plotly.js";
import apiService from "../apiService";

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
  const theme = useTheme();
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRejectedJobs, setTotalRejectedJobs] = useState(0);
  const [totalAcceptedJobs, setTotalAcceptedJobs] = useState(0);
  const [totalOAReceived, setTotalOAReceived] = useState(0);
  const [totalTechInterviewReceived, setTotalTechInterviewReceived] = useState(0);
  const [dailyJobApplications, setDailyJobApplications] = useState([]);

  useEffect(() => {
    apiService.get("/analytics")
      .then((response) => {
        setTotalJobs(response.data.totalJobs);
        setTotalRejectedJobs(response.data.totalRejectedJobs);
        setTotalAcceptedJobs(response.data.totalAcceptedJobs);
        setTotalOAReceived(response.data.totalOAReceived);
        setTotalTechInterviewReceived(response.data.totalTechInterviewReceived);
        setDailyJobApplications(response.data.dailyJobApplications.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        }));
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
      bgcolor={theme.palette.background.default}
    >
      <Paper
        elevation={3}
        style={{
          padding: "30px",
          width: "600px",
          maxWidth: "100%",
          margin: "auto",
          backgroundColor: theme.palette.background.paper, 
          borderRadius: "8px",
          boxShadow: theme.shadows[5],
          marginBottom: "20px", 
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
          width: "1000px", 
          maxWidth: "100%",
          margin: "auto",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          boxShadow: theme.shadows[5],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Daily Job Applications
        </Typography>
        {dailyJobApplications.length > 0 ? (
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
            width: 900, 
            height: 400,
            title: "Daily Job Applications",
            xaxis: { title: "Date", type: "category" },
            yaxis: {
              title: "Applications",
              tickmode: "linear",
              tick0: 0, 
              dtick: 1, 
            },
            margin: { t: 50, l: "auto", r: "auto", b: 50 },
            bargap: 0, 
            bargroupgap: 0.1,
          }}
        />
        ) : (
          <Typography variant="body1" color="textSecondary">
            No data available for daily job applications.
          </Typography>
        )}     
      </Paper>
    </Box>
  );
};

export default Analytics;