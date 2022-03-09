export type ParameterType = {
  value: unknown;
  name: string;
  type: string;
  options: {
    key: string;
    value: number;
  }[]
};

export interface ItemMain {
  value: number;
  color?: string;
}

export type BasketInfoModel = Record<string, ItemMain>;


export type ParameterFileType = {
  params: ParameterType[];
  id: string;
  headerValue: string;
  updating: boolean;
}

export type OrderModel = {
  ticketId:number;
  openTime:number;
  closeTime:Date;
  type:string;
  size:number;
  symbol:string;
  openPrice:number;
  stopLoss:number;
  takeProfit:number;
  swap:number;
  commission:number;
  profit:number;
  magicNumber:number;
  orderComment:string;
}

export type ReloadableChart={
  symbol:string;
  time:number;
  chartId:string;
  strategy_serial:number;
}

export interface BasketModel {
  basketId: string;
  serverId: string;
  serverName: string;
  name: string;
  info: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  };
  parameters: ParameterFileType[];
  orders: OrderModel[];
  tradeHistory: OrderModel[];
  reloadableCharts: ReloadableChart[];
  success: boolean;
  accessType?: AccessType;
  address: string;
}

export type UserAccessType = {
  userId: string;
  username: string;
  accessType: AccessType;
}

export enum AccessType {
  User = 1,
  Investor = 2
}

export type BasketUsers = {
  basketId: string;
  basketName: string;
  users: UserAccessType[];
};

export type BasketUserResponse = BasketUsers[];

export interface UserBasketPermission {
  id: string;
  basketId: string;
  accessType: AccessType;
  address: string;
  basketName: string;
}

export enum TimeFilterType {
  Last24Hours = 1,
  Last7Days = 2,
  Last30Days = 3,
  SpecificDate = 4
}

 
export interface ChartData {
  date: Date;
  serverId: string;
  basketId: string;
  equity: number;
  balance: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  netLot: number;
}