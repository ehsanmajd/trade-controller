import { axiosApiInstance } from ".";
import { BasketUserResponse, BasketUsers } from '../types/baskets';


const BASE_URL = process.env.REACT_APP_BACKEND_URL + '/admin';

export const getBasketsByServerIdForAdmin = async (serverId: string) => {
  const { data } = await axiosApiInstance.get(BASE_URL + `/baskets/${serverId}`);
  return data as BasketUserResponse;
}

export const updateBasketPermissions = async (serverId: string, baskets: Omit<BasketUsers, 'basketName'>[]) => {
  const { data } = await axiosApiInstance.post(BASE_URL + '/permissions/update', {
    serverId,
    baskets
  });
  return data;
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