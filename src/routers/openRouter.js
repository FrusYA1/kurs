import { Router } from 'express';
import testHandler from '../requests/test.js';
import authHandler from '../requests/user/auth.js';
import regHandler from '../requests/user/reg.js';
import refreshHandler from '../requests/user/refresh.js';

const openRouter = Router();

openRouter.get('/test', testHandler);
openRouter.post('/user/auth', authHandler);
openRouter.post('/user/reg', regHandler);
openRouter.post('/user/refresh', refreshHandler);

export default openRouter;
