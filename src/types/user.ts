export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}
export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  status: UserStatus;
}

export interface Server {
  id: string;
  address: string;
  users: User[]
}