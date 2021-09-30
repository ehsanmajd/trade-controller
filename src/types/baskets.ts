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
}
export interface BasketModel {
  serverId: string;
  name: string;
  info: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  };
  parameters: ParameterFileType[];
  success: boolean;
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