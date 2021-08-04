import { useState } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'

export function useBaskets() {
  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const [baskets, setBaskets] = useState<BasketModel[]>([]);

  async function refresh() {
    const timeStamp = new Date();
    const baskets: BasketModel[] = await service.getBaskets();
    setRefreshTime(timeStamp);
    setBaskets(baskets);
    return baskets;
  }

  return {
    refreshTime,
    baskets,
    refresh
  }
}