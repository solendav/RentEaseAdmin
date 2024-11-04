// src/api/notifications.js
import axios from 'axios';

const API_BASE_URL = 'https://renteaseadmin.onrender.com/admin';

export const fetchVerifiedProperties = async () => {
  const response = await axios.get(`${API_BASE_URL}/properties/verified`);
  return response.data;
};

export const fetchVerifiedProfiles = async () => {
  const response = await axios.get(`${API_BASE_URL}/profiles/verified`);
  return response.data;
};

export const fetchTransactions = async () => {
  const response = await axios.get(`${API_BASE_URL}/trasnsactions`);
  return response.data;
};
