import { User } from './user.interface';

export interface Post {
  user?: User;
  id?: number;
  userId?: number;
  body: string;
  createdAt?: string;
}
