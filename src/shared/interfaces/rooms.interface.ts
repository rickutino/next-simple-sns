import { IMessages } from './messages.interface';
import { IUser } from './user.interface';

export interface IRooms {
  id: string;
  messages: IMessages;
  roomUsers: {
    user: IUser;
    rooId: string;
    userId: string;
  };
}
