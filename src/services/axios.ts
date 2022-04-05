import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';

export function getAPIClient(ctx?: any) {
  const { 'next-simple-sns': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REACT_APP_HOST,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  api.interceptors.response.use(
    config => {
      return config;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.statusText === 'Unauthorized') {
          destroyCookie(undefined, 'next-simple-sns');

          Router.push('/account/login');
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
