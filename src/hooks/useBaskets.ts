import { useCallback, useEffect, useRef, useState } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'
import { useInterval } from "./useInterval";
import { useUserContext } from "../context/UserContext";
import { usePrevious } from "./usePrevious";

export function useBaskets() {
  const rendered = useRef(false);
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);
  const { data: user } = useUserContext();

  useEffect(() => {
    rendered.current = true;
  }, []);

  const refresh = useCallback(async function () {
    const timeStamp = new Date();
    let baskets: BasketModel[] = await service.getBaskets();
    if (!rendered.current) {
      baskets = baskets.filter(x => x.success);
    }
    setRefreshTime(timeStamp);
    setBaskets(baskets);
    return baskets;
  }, [user]);

  useInterval(refresh, 20 * 1000);

  const hasError = baskets.some(x => !x.success);

  return {
    refreshTime,
    baskets,
    refresh,
    hasError
  }
}