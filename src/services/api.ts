import axios, { AxiosError } from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies } from "nookies";

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
  if (error.response.status === 401) {
    if(error.response.statusText === 'Unauthorized') {
      destroyCookie(undefined, 'next-simple-sns');

      Router.push('/account/login')
    }
  };

  return Promise.reject(error);
});
