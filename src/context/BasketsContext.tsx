import React from 'react';
import { BasketModel } from '../types/baskets';

export interface BasketsContextDataModel {
  baskets: BasketModel[];
  refreshTime: Date | null;
}
export interface UserContextModel {
  data: BasketsContextDataModel;
  refresh: () => void;
  refresh2: () => void;
  reset: () => void;
  hasError: boolean;
}

export const BasketsContext = React.createContext<UserContextModel>({
  data: {
    baskets: [],
    refreshTime: null
  },
  refresh: () => undefined,
  refresh2: () => undefined,
  hasError: false,
  reset: () => undefined
});

export const useBasketsContext = () => React.useContext(BasketsContext);