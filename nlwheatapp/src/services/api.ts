import axios from 'axios';

export const api = axios.create({
  // baseURL: 'http://172.17.0.1:4000'
  // baseURL: 'http://192.168.1.112:4000'
  // baseURL: 'http://127.0.0.1:4000'
  baseURL: 'http://b40a-45-163-229-207.ngrok.io'
});
