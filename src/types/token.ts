export interface Token {
  exp: number;
  userId: string;
  name: string;
  username: string;
  roles: string[];
  askEmail: boolean;
  settings?: {
    nonifyByEmailForErrors: boolean;
  }
}