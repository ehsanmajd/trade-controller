import axios from 'axios';
import { BasketUserResponse, BasketUsers } from '../types/baskets';
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

export const addUser =
  async (name: string, username: string, password: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/users/add', {
      name,
      username,
      password,
      email: '',
      phone: '',
    });
    return data;
  }

export const updateUser =
  async (id: string, name: string, username: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/users/update', {
      id,
      name,
      username,
      email: '',
      phone: '',
    });
    return data;
  }

export const toggleActive = async (id: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/users/toggle-active', { id });
  return data;
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
  const { data } = await axiosApiInstance.get(BASE_URL + '/baskets');
  return data;
}

export const updateExpert = async (serverId: string, basketName: string, fileId: string, content: unknown, headerValue: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/baskets/update-expert', {
    fileId,
    content,
    serverId,
    basketName,
    headerValue
  });
  return data;
}

export const searchUsers = async (keyword: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/users/search?keyword=' + keyword);
  return data;
}

export const loadServers = async () => {
  const { data: servers } = await axiosApiInstance.get(BASE_URL + '/server');
  return servers;
}

export const addServer =
  async (users: unknown[], address: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/server/add', {
      address,
      users
    });
    return data;
  }

export const addServerForUser =
  async (userId: string, address: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/server/add-for-user', {
      address,
      userId
    });
    return data;
  }

export const getServersByUserId = async (userId: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/server/' + userId);
  return data as { id: string, address: string }[];
}

export const getBasketsByServerIdForAdmin = async (serverId: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + `/baskets/${serverId}`);
  return data as BasketUserResponse;
}

export const updateServer = async (id: string, address: string, userId: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/server/update', {
    address,
    id,
    userId
  });
  return data;
}

export const deleteServer = async (id: string, userId: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/server/delete', {
    userId,
    serverId: id
  });
  return data;
}

export const updateBasketPermissions = async (serverId: string, baskets: Omit<BasketUsers, 'basketName'>[]) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/permissions/update', {
    serverId,
    baskets
  });
  return data;
}