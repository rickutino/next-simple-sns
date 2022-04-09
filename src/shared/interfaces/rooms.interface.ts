import { Messages } from './messages.interface';
import { User } from './user.interface';

export interface Rooms {
  id: string;
  messages: Messages;
  roomUsers: {
    user: User;
    rooId: string;
    userId: string;
  };
}
