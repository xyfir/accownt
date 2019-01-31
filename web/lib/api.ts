import { ACCOWNT_API_URL } from 'constants/config';
import axios from 'axios';

export const api = axios.create({ baseURL: ACCOWNT_API_URL });
