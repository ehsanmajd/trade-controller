export const getAccessToken = () => sessionStorage.getItem('at');
export const setAccessToken = (token: string) => sessionStorage.setItem('at', token);
export const getRefreshToken = () => sessionStorage.getItem('rt');
export const setRefreshToken = (token: string) => sessionStorage.setItem('rt', token);
export const disposeAccessToken = () => sessionStorage.removeItem('at');
export const disposeRefreshToken = () => sessionStorage.removeItem('rt');