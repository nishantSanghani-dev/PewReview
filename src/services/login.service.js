import { API_ROUTES } from '../routes/api.routes';
import { api } from './apiClient.service';

export const loginService = (data) => {
  return api.post(API_ROUTES.login.login, data);
};
