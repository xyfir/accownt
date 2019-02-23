import axios from 'axios';

export const api = axios.create({
  baseURL: process.enve.ACCOWNT_API_URL,
  withCredentials: true
});
