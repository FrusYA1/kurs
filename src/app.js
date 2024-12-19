import express from 'express';
import authRouter from './routers/authRouter.js';
import openRouter from './routers/openRouter.js';
import bodyParser from 'body-parser';

const port = 3000;
const app = express();

//назначаем для app 2 middleware

app.use(bodyParser.json()); //указываем что в теле запроса используются json-данные и привязываем middleware для них

app.use('/api', authRouter); //authRouter - middleware-router для запросов подлежащих аутентификации
app.use('/api', openRouter); //openRouter - middleware-router для запросов не нуждающихся в аутентификации

export { port, app };
