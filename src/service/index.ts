import axios from 'axios';
export const BASE_URL = 'http://localhost:3001';
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
  const { data: users } = await axiosApiInstance.get(BASE_URL + '/');
  return users;
}

export const addUser =
  async (name: string, username: string, password: string) => {
    const { data } = await axiosApiInstance.post(BASE_URL + '/add', {
      name,
      username,
      password,
      email: '',
      phone: '',
    });
    return data;
  }

export const toggleActive = async (id: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/toggle-active', { id });
  return data;
}

export const login = async (username: string, password: string) => {
  if (!username || !password) {
    return;
  }
  const { data } = await axiosApiInstance.post(BASE_URL + '/login', { username, password });
  return data;
}

export const signOut = async (refreshToken: string) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/signout', { refreshToken });
  return data;
}

export const getBaskets = async () => {
  const { data } = await axiosApiInstance.get(BASE_URL + '/baskets');
  return data;
}

export const updateExpert = async (serverId: string, basketName: string, fileId: string, content: unknown) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/update-expert', {
    fileId,
    content,
    serverId,
    basketName
  });
  return data;
}

