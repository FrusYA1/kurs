import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import userInfoHandler from '../requests/user/info.js';
import userEditHandler from '../requests/user/edit.js';
import blockHandler from '../requests/user/block.js';
import unblockHandler from '../requests/user/unblock.js';
import userSendHandler from '../requests/user/send.js';
import userUnsendHandler from '../requests/user/unsend.js';
import userMessagesHandler from '../requests/user/messages.js';
import createHandler from '../requests/chat/create.js';
import chatInfoHandler from '../requests/chat/info.js';
import chatEditHandler from '../requests/chat/edit.js';
import kickHandler from '../requests/chat/kick.js';
import addHandler from '../requests/chat/add.js';
import chatSendHandler from '../requests/chat/send.js';
import chatUnsendHandler from '../requests/chat/unsend.js';
import chatMessagesHandler from '../requests/chat/messages.js';

const authRouter = Router();

authRouter.get('/user/:user_id/info', authMiddleware, userInfoHandler);
authRouter.patch('/user/:user_id/edit', authMiddleware, userEditHandler);
authRouter.put('/user/:user_id/block/:blocked_id', authMiddleware, blockHandler);
authRouter.delete('/user/:user_id/unblock/:blocked_id', authMiddleware, unblockHandler);
authRouter.post('/user/:user_id/send/:recipient_id', authMiddleware, userSendHandler);
authRouter.delete('/user/:user_id/unsend/:recipient_id/:message_id', authMiddleware, userUnsendHandler);
authRouter.get('/user/:user_id/messages/:contact_id', authMiddleware, userMessagesHandler);

authRouter.post('/user/:user_id/chat/create', authMiddleware, createHandler);
authRouter.get('/user/:user_id/chat/:chat_id/info', authMiddleware, chatInfoHandler);
authRouter.patch('/user/:user_id/chat/:chat_id/edit', authMiddleware, adminMiddleware, chatEditHandler);
authRouter.delete('/user/:user_id/chat/:chat_id/kick/:kicked_id', authMiddleware, adminMiddleware, kickHandler);
authRouter.put('/user/:user_id/chat/:chat_id/add/:added_id', authMiddleware, adminMiddleware, addHandler);
authRouter.post('/user/:user_id/chat/:chat_id/send', authMiddleware, chatSendHandler);
authRouter.delete('/user/:user_id/chat/:chat_id/unsend/:message_id', authMiddleware, chatUnsendHandler);
authRouter.get('/user/:user_id/chat/:chat_id/messages', authMiddleware, chatMessagesHandler);

export default authRouter;
