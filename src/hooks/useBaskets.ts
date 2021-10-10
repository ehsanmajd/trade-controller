import { useCallback } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'
import useThunkReducer from 'react-hook-thunk-reducer';
import { useInterval } from "./useInterval";
interface State {
  refreshTime: Date | null;
  baskets: BasketModel[];
}

const INIT_STATE = {
  baskets: [],
  refreshTime: null
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'REFRESH':
      {
        let newBaskets = [];
        const { baskets } = state;
        if (baskets.length === 0) {
          newBaskets = action.payload.baskets.filter(x => x.success);
        }
        else {
          newBaskets = action.payload.baskets.filter(x => baskets.some(p => p.serverId === x.serverId));
        }
        return {
          ...state,
          refreshTime: action.payload.timeStamp,
          baskets: newBaskets
        }
      }
    case 'RESET':
      return INIT_STATE;
    default:
      return state;
  }
}

const refreshActionCreator = () => {
  return async (dispatch) => {
    const timeStamp = new Date();
    const baskets: BasketModel[] = await service.getBaskets();
    dispatch({ type: 'REFRESH', payload: { baskets, timeStamp } });
  }
}

export function useBaskets() {
  const [{ refreshTime, baskets }, dispatch] = useThunkReducer(reducer, INIT_STATE);
  const hasError = baskets.some(x => !x.success);

  const refresh = useCallback(() => dispatch(refreshActionCreator()), [dispatch]);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [dispatch]);
  useInterval(refresh, 20 * 1000);

  return {
    refreshTime,
    baskets,
    refresh,
    hasError,
    reset
  }
}