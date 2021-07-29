import axios from 'axios';
export const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
export const axiosApiInstance = axios.create();

const refreshAccessToken = () => {
  return new Promise(resolve => {
    const refreshToken = window.localStorage.getItem('rt');
    if (refreshToken) {
      fetch(BASE_URL + '/auth', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: window.localStorage.getItem('rt') }),
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
    const accessToken = window.localStorage.getItem('at');
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
    window.localStorage.setItem('at', access_token);
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

export const updateServer = async (id: string, address: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/server/update', {
    address,
    id
  });
  return data;
}

export const deleteServer = async (id: string) => {
  const { data } = await axiosApiInstance.delete(BASE_URL + '/server/' + id);
  return data;
}