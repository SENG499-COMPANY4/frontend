import axios from 'axios';

const DEV_URL = 'http://localhost:8000';
const STAGE_URL = 'https://spring-sky-3750.fly.dev/api';


const API = axios.create({
  baseURL: STAGE_URL,
  withCredentials: true
});

// Import this object instead of axios
// make API requests like:
// API.get("/api/login").then(...)
export default API;
