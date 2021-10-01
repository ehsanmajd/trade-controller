export const getAccessToken = () => localStorage.getItem('at');
export const setAccessToken = (token: string) => localStorage.setItem('at', token);
export const getRefreshToken = () => localStorage.getItem('rt');