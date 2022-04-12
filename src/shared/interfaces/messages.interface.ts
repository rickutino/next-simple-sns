import { Post } from './post.interface';
import { User } from './user.interface';

export interface Messages {
  id?: number;
  roomId?: string;
  post?: Post;
  postId?: number;
  user?: User;
  userId?: number;
  content?: string;
  createdAt?: string;
}
