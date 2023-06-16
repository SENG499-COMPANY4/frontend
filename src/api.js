import axios from 'axios';

const DEV_URL = 'http://localhost:8000';
const STAGE_URL = 'https://seng-499-backend.up.railway.app/';


const API = axios.create({
  baseURL: STAGE_URL
});

// Import this object instead of axios
// make API requests like:
// API.get("/api/login").then(...)
export default API;