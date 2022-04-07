import axios, { AxiosError, AxiosResponse } from 'axios';
import Router from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';

export function getAPIClient(ctx?: any) {
  const { 'next-simple-sns': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'https://simp-340605.an.r.appspot.com/',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  api.interceptors.response.use<AxiosResponse>(
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
