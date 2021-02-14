import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_CALLCENTER_URL,
  responseType: 'json',
});
