import { Box, Button, TextField, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";

const Terms = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [mode, setMode] = useState("view");
  const [terms, setTerms] = useState("");
  const [version, setVersion] = useState("");
  const [termsList, setTermsList] = useState([]);
  const [editTerm, setEditTerm] = useState(null);

  useEffect(() => {
    // Fetch terms and conditions from the backend
    const fetchTerms = async () => {
      try {
        const response = await axios.get("https://renteaseadmin.onrender.com/admin/terms");
        setTermsList(response.data);
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);

  const handleAddTerms = async () => {
    try {
      await axios.post("https://renteaseadmin.onrender.com/admin/terms", {
        content: terms,
        version: version,
      });
      // Refresh the terms list after adding
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/terms");
      setTermsList(response.data);
      setTerms("");
      setVersion("");
    } catch (error) {
      console.error("Error adding terms:", error);
    }
  };

  const handleUpdateTerms = async (id) => {
    try {
      await axios.put(`https://renteaseadmin.onrender.com/admin/terms/${id}`, { content: terms });
      // Refresh the terms list after updating
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/terms");
      setTermsList(response.data);
      setEditTerm(null);
      setTerms("");
      setVersion("");
      setMode("view"); // Switch back to view mode after update
    } catch (error) {
      console.error("Error updating terms:", error);
    }
  };

  const handleDeleteTerms = async (id) => {
    try {
      await axios.delete(`https://renteaseadmin.onrender.com/admin/terms/${id}`);
      // Refresh the terms list after deleting
      const response = await axios.get("https://renteaseadmin.onrender.com/admin/terms");
      setTermsList(response.data);
    } catch (error) {
      console.error("Error deleting terms:", error);
    }
  };

  const handleEditClick = (term) => {
    setEditTerm(term);
    setTerms(term.content);
    setVersion(term.version);
    setMode("add");
  };

  return (
    <Box m="20px">
      <Header title="Terms and Conditions" subtitle="Manage your terms and conditions here" />
      
      <Box display="flex"  mb="20px">
        <ToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(e, newMode) => setMode(newMode)}
          aria-label="text alignment"
          sx={{
            mb: "20px",
            border: '1px solid #ddd',
            borderRadius: '5px',
            '& .MuiToggleButton-root': {
              border: '1px solid #ddd',
              color: '#000',
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            },
          }}
        >
          <ToggleButton value="add">Add Terms</ToggleButton>
          <ToggleButton value="view">View Terms</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {mode === "add" && (
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          width={isNonMobile ? "50%" : "50%"}
          m="0" // Remove auto margin to align left
          ml={isNonMobile ? "0" : "0"} // Align left for non-mobile screens
        >
          <TextField
            label="Terms Content"
            variant="outlined"
            multiline
            rows={4}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
          <TextField
            label="Version"
            variant="outlined"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (editTerm) {
                handleUpdateTerms(editTerm._id);
              } else {
                handleAddTerms();
              }
            }}
          >
            {editTerm ? "Update Terms" : "Add Terms"}
          </Button>
        </Box>
      )}

      {mode === "view" && (
        <Box mt="20px">
          <Typography variant="h6" gutterBottom>
            Existing Terms and Conditions
          </Typography>
          {termsList.map((term) => (
            <Box key={term._id} mb="10px" p="10px" border="1px solid #ddd">
              <Typography variant="body1"><strong>Version:</strong> {term.version}</Typography>
              <Typography variant="body2"><strong>Content:</strong> {term.content}</Typography>
              <Box mt="10px">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditClick(term)}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteTerms(term._id)}
                  sx={{ ml: "10px" }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Terms;
