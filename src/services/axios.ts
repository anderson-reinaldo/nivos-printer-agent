import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4100/',
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(async(req) => {

  return req;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use((res) => {
  return res;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
