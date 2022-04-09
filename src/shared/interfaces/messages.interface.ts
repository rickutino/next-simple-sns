import { Posts } from './posts.interface';
import { User } from './user.interface';

export interface Messages {
  id?: number;
  roomId?: string;
  post?: Posts;
  postId?: number;
  user?: User;
  userId?: number;
  content?: string;
  createdAt?: string;
}
