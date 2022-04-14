import { IMessage } from './message.interface';
import { IUser } from './user.interface';

export interface IRoom {
  id: string;
  messages: IMessage;
  roomUsers: {
    user: IUser;
    rooId: string;
    userId: string;
  };
}
