import { IPost } from './post.interface';
import { IUser } from './user.interface';

export interface IMessage {
  id?: number;
  roomId?: string;
  post?: IPost;
  postId?: number;
  user?: IUser;
  userId?: number;
  content?: string;
  createdAt?: string;
}
