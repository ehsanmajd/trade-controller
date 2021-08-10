import React from 'react';
import { BasketModel } from '../types/baskets';

export interface BasketsContextDataModel {
  baskets: BasketModel[];
  refreshTime: Date | null;
}
export interface UserContextModel {
  data: BasketsContextDataModel;
  refresh: () => void;
  hasError: boolean;
}

export const BasketsContext = React.createContext<UserContextModel>({
  data: {
    baskets: [],
    refreshTime: null
  },
  refresh: () => undefined,
  hasError: false
});

export const useBasketsContext = () => React.useContext(BasketsContext);