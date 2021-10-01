export interface Token {
  exp: number;
  userId: string;
  name: string;
  username: string;
  roles: string[];
}