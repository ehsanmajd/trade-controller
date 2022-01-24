export const getLastViewedBasket = () => sessionStorage.getItem('lastViewedBasket');
export const setLastViewedBasket = (basketId: string) => sessionStorage.setItem('lastViewedBasket', basketId);
