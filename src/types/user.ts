export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface Server {
  id: string;
  address: string;
  users: User[]
}