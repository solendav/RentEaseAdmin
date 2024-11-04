import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import PersonIcon from "@mui/icons-material/Person"; // Importing user icon
import HouseIcon from "@mui/icons-material/House"; // Importing house icon
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Importing money icon
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Importing calendar icon for rent
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";

// Additional imports for new icons
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // For revenue
import EventNoteIcon from "@mui/icons-material/EventNote"; // For daily bookings

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State to store the total number of users, properties, transactions, rents, and balance
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalRents, setTotalRents] = useState(0);
  const [balance, setBalance] = useState(null); // Added state for balance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, propertiesResponse, transactionsResponse, rentsResponse, balanceResponse] = await Promise.all([
          axios.get("https://renteaseadmin.onrender.com/admin/total-users"),
          axios.get("https://renteaseadmin.onrender.com/admin/total-properties"),
          axios.get("https://renteaseadmin.onrender.com/admin/total-transactions"),
          axios.get("https://renteaseadmin.onrender.com/admin/total-rents"),
          axios.get("https://renteaseadmin.onrender.com/admin/balance?user_id=66e05fd6bfa431de8dafab89"), // Fetching balance
        ]);

        setTotalUsers(usersResponse.data.totalUsers);
        setTotalProperties(propertiesResponse.data.totalProperties);
        setTotalTransactions(transactionsResponse.data.totalTransactions);
        setTotalRents(rentsResponse.data.totalRents);
        setBalance(balanceResponse.data.balance); // Setting balance
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalUsers}
            subtitle="Total Users"
            progress="0.80"
            increase="+43%"
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalProperties}
            subtitle="Total Properties"
            progress="0.50"
            increase="+21%"
            icon={
              <HouseIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalTransactions.toLocaleString()}
            subtitle="Total Transactions"
            progress="0.30"
            increase="+5%"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalRents.toLocaleString()}
            subtitle="Total Rents"
            progress="0.80"
            increase="+43%"
            icon={
              <CalendarTodayIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 7"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Revenue Generated
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  {balance !== null ? `$${balance.toLocaleString()}` : "Loading..."}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box height="290px" m="10px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 5"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box display="flex" alignItems="center" p="30px">
            <EventNoteIcon sx={{ color: colors.greenAccent[500], fontSize: "30px", mr: 1 }} />
            <Typography
              variant="h5"
              fontWeight="600"
            >
              Daily Bookings
            </Typography>
          </Box>
          <Box height="290px" mt="10px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
