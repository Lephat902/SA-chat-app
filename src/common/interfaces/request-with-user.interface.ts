import { Request } from 'express';
import { User } from 'src/user/entities';

export interface RequestWithUser extends Request {
  user: User;
}
