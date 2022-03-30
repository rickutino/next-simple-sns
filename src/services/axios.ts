import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';

export function getAPIClient(ctx?: any) {
  const cookies = parseCookies(ctx);
  const { 'next-simple-sns': token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'https://simp-340605.an.r.appspot.com/',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  api.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        console.log('erro', error.response);
        console.log('cookies', cookies);
        console.log('token', token);
        console.log('parseCookies', parseCookies(ctx));
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
