/* eslint-disable dot-notation */
import axios, { AxiosError, AxiosResponse } from 'axios';
import Router from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import { tokenKey } from '../shared/const';

export function getAPIClient(ctx?: any) {
  const api = axios.create({
    baseURL: 'https://simp-340605.an.r.appspot.com/'
  });

  api.interceptors.request.use(request => {
    const userToken = parseCookies(ctx);

    request.headers['Authorization'] = userToken[tokenKey]
      ? `Bearer ${userToken[tokenKey]}`
      : '';

    return request;
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
