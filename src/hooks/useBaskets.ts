import { useCallback, useState } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'
import { useInterval } from "./useInterval";
import { useUserContext } from "../context/UserContext";

export function useBaskets() {
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);
  const { data: user } = useUserContext();

  const refresh = useCallback(async function () {
    const timeStamp = new Date();
    const baskets: BasketModel[] = await service.getBaskets();
    setRefreshTime(timeStamp);
    setBaskets(baskets);
    return baskets;

  }, [user]);

  useInterval(refresh, 20 * 1000);

  return {
    refreshTime,
    baskets,
    refresh
  }
}