import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: `Bearer ${cookies['next-simple-sns']}`
  }
});

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  console.log(error.response);
});
