import axios from 'axios';

const DEV_URL = 'http://localhost:8000';
const STAGE_URL = 'https://spring-sky-3750.fly.dev/api';


const API = axios.create({
  baseURL: STAGE_URL,
  withCredentials: true
});

// Adding function to check the schedule's validity
export const validateSchedule = (scheduleData) => {
  return API.post('/schedule/validate', scheduleData)
    .then((response) => {
      return response.data.isValid;
    })
    .catch((error) => {
      // Handle any error that might occur during the API request
      console.error('Error validating schedule:', error);
      throw error; 
    });
};

// Import this object instead of axios
// make API requests like:
// API.get("/api/login").then(...)
export default API;