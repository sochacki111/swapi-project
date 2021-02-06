import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.SWAPI_BASE_URL
});

export default instance;
