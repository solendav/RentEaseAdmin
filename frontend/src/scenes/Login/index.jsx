import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, IconButton, useTheme, Typography, TextField, Button, InputAdornment, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import { Typewriter } from "react-simple-typewriter";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      p={2}
      position="absolute"
      top={16}
      right={16}
      width="auto"
      zIndex={1000}
    >
      <IconButton onClick={colorMode.toggleColorMode}>
        {theme.palette.mode === "dark" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
    </Box>
  );
};

const LoginForm = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const pageBackgroundColor = theme.palette.mode === "light" ? "#f8f9fa" : colors.primary[500];
  const formBackgroundColor = theme.palette.mode === "light" ? "#ffffff" : colors.primary[400];
  const inputBackgroundColor = theme.palette.mode === "light" ? "#ffffff" : formBackgroundColor;
  const textColor = theme.palette.mode === "light" ? "#333333" : "#f3e9d3";
  const buttonColor = theme.palette.mode === "light" ? "#a4a9fc" : colors.primary[300];

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post("https://renteaseadmin.onrender.com/admin/signIn", {
        user_name: username,
        password
      });
      localStorage.setItem("token", response.data.token);
      onLogin();
      setLoading(false); // Stop loading
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.message : "An unexpected error occurred";
      setError(errorMessage);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor={pageBackgroundColor}
      p={5}
    >
      <Topbar />

      <Box
        bgcolor={formBackgroundColor}
        p={6}
        borderRadius="8px"
        boxShadow={theme.palette.mode === "light" ? "0px 4px 12px rgba(0, 0, 0, 0.1)" : "0px 4px 12px rgba(0, 0, 0, 0.3)"}
        width="100%"
        maxWidth="500px"
        mt={4}
        textAlign="center"
      >
        <Typography variant="h4" sx={{ mb: 3, color: textColor }}>
          <Typewriter
            words={['Welcome to RentEase Admin Portal']}
            loop={true}
            cursor
            cursorStyle="I"
            typeSpeed={90}
            delaySpeed={1500}
          />
        </Typography>
        {error && (
          <Typography variant="body1" sx={{ color: 'red', mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          placeholder="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            mb: 2,
            bgcolor: inputBackgroundColor,
            input: { color: textColor },
            borderRadius: "8px",
            boxShadow: theme.palette.mode === 'dark' ? "0px 4px 8px rgba(0, 0, 0, 0.3)" : "none",
            '&:hover': {
              bgcolor: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#ccc' : colors.primary[400],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#999' : colors.primary[500],
              },
            },
            '& .MuiInputBase-input': {
              padding: '12px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleOutlinedIcon sx={{ color: textColor }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          placeholder="Password"
          variant="outlined"
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            mb: 2,
            bgcolor: inputBackgroundColor,
            input: { color: textColor },
            borderRadius: "8px",
            boxShadow: theme.palette.mode === 'dark' ? "0px 4px 8px rgba(0, 0, 0, 0.3)" : "none",
            '&:hover': {
              bgcolor: theme.palette.mode === 'light' ? '#f1f1f1' : '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#ccc' : colors.primary[400],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#999' : colors.primary[500],
              },
            },
            '& .MuiInputBase-input': {
              padding: '12px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: textColor }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon sx={{ color: textColor }} />
                  ) : (
                    <VisibilityOutlinedIcon sx={{ color: textColor }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: buttonColor,
            color: 'white',
            fontSize: '1.2rem',
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
            '&:hover': {
              bgcolor: theme.palette.mode === 'light' ? '#8a9afc' : '#045a8d',
            }
          }}
          onClick={handleLogin}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} /> // Show loading spinner
          ) : (
            "Login" // Show button text
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
