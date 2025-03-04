import { Router } from 'express';
import { messageController } from './message.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';
import { multerUpload } from '../../../src/config/multer.config';

const route = Router();

route.post(
  '/send',
  auth(USER_ROLES.admin, USER_ROLES.user),
  multerUpload.single('image'),
  messageController.sendMessage,
);
route.get(
  '/',
  auth(USER_ROLES.admin, USER_ROLES.user),
  messageController.getAllMessages,
);

route.get(
  '/:id',
  auth(USER_ROLES.admin, USER_ROLES.user),
  messageController.getMessages,
);

route.delete('/:id', messageController.deleteMessage);

export const messageRoute = route;
