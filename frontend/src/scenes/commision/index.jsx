import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Checkbox, FormControlLabel, FormGroup, useTheme } from "@mui/material";
import { AccountBalanceWalletOutlined, AttachMoney, Visibility, VisibilityOff } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { tokens } from "../../theme";

const Commission = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({
    "own-deposit": false,
    "transfer": false,
    "service_fee": false,
    "withdrawal": false,
    "deposit": false
  });

  // Function to fetch balance
  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/balance?user_id=66e05fd6bfa431de8dafab89");
      setBalance(response.data.balance);
      setBalanceVisible(true);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/transactions");
      const sortedTransactions = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBalance = () => {
    if (!balanceVisible) {
      fetchBalance();
    } else {
      setBalanceVisible(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [name]: checked
    }));
  };

  useEffect(() => {
    const activeFilters = Object.keys(selectedTypes).filter((type) => selectedTypes[type]);

    if (activeFilters.length === 0) {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((transaction) => activeFilters.includes(transaction.type));
      setFilteredTransactions(filtered);
    }
  }, [selectedTypes, transactions]);

  useEffect(() => {
    fetchTransactions();

    // Set up polling to fetch transactions every 10 seconds
    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box m="20px">
      {/* Wallet Section */}
      <Box textAlign="center">
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <AccountBalanceWalletOutlined sx={{ fontSize: 80, color: "#3498db" }} />
          <Typography variant={isNonMobile ? "h3" : "h4"} fontWeight="bold" mt={1}>
            Rentease Admin Wallet
          </Typography>
        </Box>

        {/* Buttons Section */}
        <Box display="flex" justifyContent="center" gap={4} mt={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AttachMoney sx={{ fontSize: 30 }} />}
            sx={{
              padding: "15px 25px",
              borderRadius: "12px",
              backgroundColor: "#e74c3c",
              "&:hover": { backgroundColor: "#c0392b" },
              boxShadow: "0px 4px 12px rgba(231, 76, 60, 0.5)",
              fontSize: "18px",
            }}
          >
            Withdraw
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={
              balanceVisible ? <Visibility sx={{ fontSize: 30 }} /> : <VisibilityOff sx={{ fontSize: 30 }} />
            }
            onClick={handleToggleBalance}
            sx={{
              padding: "15px 25px",
              borderRadius: "12px",
              border: "2px solid #2980b9",
              color: "#2980b9",
              "&:hover": { backgroundColor: "#ecf0f1" },
              boxShadow: "0px 4px 12px rgba(41, 128, 185, 0.5)",
              fontSize: "18px",
            }}
          >
            {loading ? "Loading..." : balanceVisible ? `Balance: $${balance}` : "View Balance"}
          </Button>
        </Box>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Filter Section */}
      <Box display="flex" alignItems="flex-start" gap={2} mb={2} mt={4}>
        <Typography variant="h4" fontWeight="bold" sx={{ flexShrink: 0 }}>
          Filter Transactions
        </Typography>
        <FormGroup
          row
          sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
        >
          {Object.keys(selectedTypes).map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedTypes[type]}
                  onChange={handleCheckboxChange}
                  name={type}
                  sx={{
                    width: "10px",
                    height: "10px",
                    paddingRight:'1rem',
                    color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                    '&.Mui-checked': {
                      color: theme.palette.mode === "dark" ? "#ffffff" : "#2980b9",
                    },
                  }}
                />
              }
              label={type.replace("_", " ")}
              sx={{
                fontSize: "1.15rem",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                ml: 1,
                '& .MuiFormControlLabel-label': {
                  fontSize: '1.15rem',
                }
              }}
            />
          ))}
        </FormGroup>
      </Box>

      {/* Recent Transactions Heading */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        color={theme.palette.mode === "dark" ? "#ecf0f1" : "#000000"}
      >
        Recent Transactions
      </Typography>

      {/* Transactions Section */}
      <Box
        backgroundColor={theme.palette.mode === "dark" ? colors.primary[600] : "#ffffff"}
        overflow="auto"
        borderRadius="10px"
        p="20px"
        gridColumn="span 4"
        gridRow="span 2"
        sx={{
          maxHeight: "400px",
          boxShadow: theme.palette.mode === "dark" ? "0px 4px 8px rgba(0, 0, 0, 0.6)" : "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          borderBottom={`4px solid ${theme.palette.mode === "dark" ? colors.primary[700] : "#dcdcdc"}`}
          p="15px"
          color={theme.palette.mode === "dark" ? "#ecf0f1" : "#000000"}
        >
          {/* Column Headers */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(5, 1fr)"
            gap="10px"
            borderBottom={`2px solid ${theme.palette.mode === "dark" ? colors.primary[700] : "#dcdcdc"}`}
            p="10px 0"
            fontWeight="bold"
          >
            <Typography>No</Typography>
            <Typography>Username</Typography>
            <Typography>Type</Typography>
            <Typography>Created Date</Typography>
            <Typography>Amount</Typography>
          </Box>

          {/* Filtered Transactions */}
          {filteredTransactions.map((transaction, index) => (
            <Box
              key={transaction._id}
              display="grid"
              gridTemplateColumns="repeat(5, 1fr)"
              gap="10px"
              p="10px 0"
              borderBottom={`1px solid ${theme.palette.mode === "dark" ? colors.primary[700] : "#dcdcdc"}`}
            >
              <Typography>{index + 1}</Typography>
              <Typography>{transaction.user_id.user_name}</Typography>
              <Typography>{transaction.type}</Typography>
              <Typography>{new Date(transaction.createdAt).toLocaleDateString()}</Typography>
              <Typography>${transaction.amount.toFixed(2)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Commission;
