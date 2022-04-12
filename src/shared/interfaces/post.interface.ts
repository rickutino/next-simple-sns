import { IUser } from './user.interface';

export interface IPost {
  user?: IUser;
  id?: number;
  userId?: number;
  body: string;
  createdAt?: string;
}
