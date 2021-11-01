import axios from 'axios';
import FileSaver from 'file-saver';
import { BasketUsers } from '../types/baskets';
import { getAccessToken, getRefreshToken, setAccessToken } from '../utils/token';
export const BASE_URL = process.env.REACT_APP_BACKEND_URL;
export const axiosApiInstance = axios.create();

const refreshAccessToken = () => {
  return new Promise(resolve => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      fetch(BASE_URL + '/auth', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: refreshToken }),
        method: 'POST'
      })
        .then(x => x.json())
        .then(({ accessToken }) => resolve(accessToken))
    }
    return '';
  })
}

axiosApiInstance.interceptors.request.use(
  async config => {
    const accessToken = getAccessToken();
    config.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    return config;
  },
  error => {
    Promise.reject(error)
  });

axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    const access_token = await refreshAccessToken() as string;
    setAccessToken(access_token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});

export const loadUsers = async () => {
  const { data: users } = await axiosApiInstance.get(BASE_URL + '/users');
  return users;
}

export const login = async (username: string, password: string) => {
  if (!username || !password) {
    return;
  }
  const { data } = await axiosApiInstance.post(BASE_URL + '/users/login', { username, password });
  return data;
}

export const signOut = async (refreshToken: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/users/signout', { refreshToken });
  return data;
}

export const getBaskets = async () => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/baskets?v2=1');
  return data;
}

export const updateExpert = async (
  {
    serverId,
    basketId,
    basketName,
    fileId,
    content,
    headerValue,
    prvContent
  }:
    {
      serverId: string,
      basketId: string,
      basketName: string,
      fileId: string,
      content: unknown,
      headerValue: string,
      prvContent: unknown
    }) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/baskets/update-expert', {
    fileId,
    content,
    serverId,
    basketName,
    basketId,
    headerValue,
    prvContent
  });
  return data;
}

export const searchUsers = async (keyword: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/users/search?keyword=' + keyword);
  return data;
}

export const loadMyServers = async () => {
  const { data: servers } = await axiosApiInstance.get(BASE_URL + '/server');
  return servers;
}

export const loadServer = async (serverId: string) => {
  const { data: servers } = await axiosApiInstance.get(BASE_URL + '/server/' + serverId);
  return servers;
}

export const loadMyBaskets = async () => {
  const { data: servers } = await axiosApiInstance.get(BASE_URL + '/server?v2=1');
  return servers;
}

export const loadSharedServers = async () => {
  const { data: servers } = await axiosApiInstance.get(BASE_URL + '/server?shared=true');
  return servers;
}

export const addServer =
  async (address: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/server', {
      address
    });
    return data;
  }

export const deleteMyServer = async (id: string) => {
  const { data } = await axiosApiInstance.delete(BASE_URL + '/server/' + id);
  return data;
}

export const deleteSharedBasket = async (id: string) => {
  const { data } = await axiosApiInstance.delete(BASE_URL + `/permission/${id}`);
  return data;
}

export const updateServer = async (id: string, address: string) => {
  const { data } = await axiosApiInstance.put(BASE_URL + `/server/`, {
    id,
    address
  });
  return data;
}

export const updateBasketPermissions = async (serverId: string, baskets: Omit<BasketUsers, 'basketName'>[]) => {
  const { data } = await axiosApiInstance.put(BASE_URL + '/permission', {
    serverId,
    baskets
  });
  return data;
}

export const getBasketLogs = async (basketId: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/logs/' + basketId);
  return data;
}

export const exportBaskets = async (username: string) => {
  const response = await axiosApiInstance.get(BASE_URL + '/baskets?download=1', {
    responseType: 'blob'
  });
  const filename = `Mybasket-${username}-${new Date().toLocaleString()}.xlsx`;
  FileSaver.saveAs(response.data, filename);
}

export const getBasketStatistics = async (basketId: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/statistics/' + basketId);
  return data;
}