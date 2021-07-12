import { BASE_URL, axiosApiInstance } from './index';

const baseUrl = BASE_URL + '/server';

export const loadServers = async () => {
  const { data: servers } = await axiosApiInstance.get(baseUrl + '/');
  return servers;
}

export const toggleActive = async (id: string) => {
  const { data } = await axiosApiInstance.post(baseUrl + '/toggle-active', { id });
  return data;
}

export const addServer =
  async (name: string, address: string) => {
    const { data } = await axiosApiInstance.post(baseUrl + '/add', {
      name,
      address
    });
    return data;
  }