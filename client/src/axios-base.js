import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_DOMAIN || 'http://localhost:8080/api'
});

export default instance;
