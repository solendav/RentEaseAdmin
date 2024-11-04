import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleIcon from "@mui/icons-material/People";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupIcon from "@mui/icons-material/Group"; // Group of people icon for "Both"
import DescriptionIcon from "@mui/icons-material/Description";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HouseIcon from "@mui/icons-material/House"; // Rent icon for "Rented"
import ApartmentIcon from "@mui/icons-material/Apartment"; // Property icon for "Property Verification"
import { fetchVerifiedProperties, fetchVerifiedProfiles, fetchTransactions } from '../../api/notifications';
import axios from "axios";

// Item component with circular notification badge
const Item = ({ title, to, icon, selected, setSelected, count, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        position: 'relative',
      }}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick();
      }}
      icon={icon}
    >
      <Typography fontSize="16px">{title}</Typography> {/* Increased font size */}
      {count > 0 && (
        <Box
          sx={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'red',
            color: 'white',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {count}
        </Box>
      )}
      <Link to={to} />
    </MenuItem>
  );
};

// Sidebar component
const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [adminData, setAdminData] = useState({
    username: '',
    role: '',
    profilePic: ''
  });
  const [accountVerificationCount, setAccountVerificationCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("https://renteaseadmin.onrender.com/admin/profile");
        setAdminData({
          username: response.data.username || 'Username',
          role: response.data.role || 'Role',
          profilePic: response.data.profilePic || `../../assets/user.png`
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    const fetchVerificationCounts = async () => {
      try {
        const verifiedProfiles = await fetchVerifiedProfiles();
        setAccountVerificationCount(verifiedProfiles.length || 0);
      } catch (error) {
        console.error("Error fetching verified profiles:", error);
      }
    };

    const fetchPropertiesCount = async () => {
      try {
        const verifiedProperties = await fetchVerifiedProperties();
        setPropertiesCount(verifiedProperties.length || 0);
      } catch (error) {
        console.error("Error fetching verified properties:", error);
      }
    };

    fetchAdminData();
    fetchVerificationCounts();
    fetchPropertiesCount();

    const intervalId1 = setInterval(fetchVerificationCounts, 1000); // 10 seconds
    const intervalId2 = setInterval(fetchPropertiesCount, 1000); // 10 seconds

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
          
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={adminData.profilePic}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4" // Increased text size
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {adminData.username}
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  {adminData.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "9%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Commision"
              to="/commision"
              icon={<AttachMoneyIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
              fontSize="15px" // Increased text size
            >
              Users
            </Typography>
            <Item
              title="Tenant only"
              to="/tenants"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Owners only"
              to="/owners"
              icon={<GroupAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Both"
              to="/both"
              icon={<GroupIcon />}  // Updated icon
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
              fontSize="15px" // Increased text size
            >
              Properties
            </Typography>
            <Item
              title="Active Post"
              to="/Active"
              icon={<PostAddIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Rented"
              to="/rented"
              icon={<HouseIcon />}  // Updated icon
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
              fontSize="15px" // Increased text size
            >
              Verification
            </Typography>
            <Item
              title="Account Verification"
              to="/account"
              icon={<VerifiedUserIcon />}
              selected={selected}
              setSelected={setSelected}
              count={accountVerificationCount}
            />
            <Item
              title="Property Verification"
              to="/property"
              icon={<ApartmentIcon />}  // Updated icon
              selected={selected}
              setSelected={setSelected}
              count={propertiesCount}
            />
            <Item
              title="Terms and Conditions"
              to="/terms"
              icon={<DescriptionIcon />}  // Icon for terms and conditions
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Others"
              to="/disputes"
              icon={<DescriptionIcon />}  // Icon for terms and conditions
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
