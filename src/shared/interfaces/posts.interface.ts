import { User } from './user.interface';

export interface Posts {
  user?: User;
  id?: number;
  userId?: number;
  body: string;
  createdAt?: string;
}
