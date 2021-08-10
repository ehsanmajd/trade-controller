import { useCallback, useEffect, useRef, useState } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'
import { useInterval } from "./useInterval";
import { useUserContext } from "../context/UserContext";
import { usePrevious } from "./usePrevious";

export function useBaskets() {
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);
  const { data: user } = useUserContext();
  const prevBaskets = usePrevious(baskets);

  const refresh = useCallback(async function () {
    const timeStamp = new Date();
    let baskets: BasketModel[] = await service.getBaskets();
    if (prevBaskets === undefined) {
      baskets = baskets.filter(x => x.success);
    }
    setRefreshTime(timeStamp);
    setBaskets(baskets);
    return baskets;
  }, [user, prevBaskets]);

  useInterval(refresh, 20 * 1000);

  const hasError = baskets.some(x => !x.success);

  return {
    refreshTime,
    baskets,
    refresh,
    hasError
  }
}