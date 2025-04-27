import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface KeycloakConfig {
  url: string;
  clientId: string;
  clientSecret: string;
logoutUrl: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

const keycloakConfig: KeycloakConfig = {
  url: 'https://demo.pixelkube.io/auth/realms/master/protocol/openid-connect/token',
  clientId: 'vericlient',
  clientSecret: 'HoE61uYX3YNBv5f99B3890HYYoEpGiGQ',
  logoutUrl: 'https://demo.pixelkube.io/auth/realms/master/protocol/openid-connect/logout'
};

const AuthService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axios.post<AuthResponse>(keycloakConfig.url, params);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      return response.data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
      const refresh_token = localStorage.getItem('refresh_token');
      const token = localStorage.getItem('token');
    try{
        const params = new URLSearchParams();
        params.append('client_id', keycloakConfig.clientId);
        params.append('refresh_token', refresh_token || '');
        params.append('client_secret', keycloakConfig.clientSecret);
        const headers = {
            "Authorization": `Bearer ${token}`
        }
        const response = await axios.post(keycloakConfig.logoutUrl, params, {headers: headers});
        console.log(response);
    }
    catch (error) {
      console.error('Logout failed', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('refresh_token', refreshToken || '');

    try {
      const response = await axios.post<AuthResponse>(keycloakConfig.url, params);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      return response.data;
    } catch (error) {
      console.error('Token refresh failed', error);
      throw error;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = AuthService.getToken();
    config.headers = config.headers || {}; // Ensure headers is not undefined
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newTokens = await AuthService.refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        AuthService.logout();
        window.location.href = '/login'; // Redirect to login page if refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default AuthService;
