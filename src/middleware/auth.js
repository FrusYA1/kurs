import jwt, { decode } from 'jsonwebtoken';
import { ACCESS, REFRESH } from '../config.js';
import connection from '../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

const authMiddleware = (req, res, next) => {
        try {
                const accessToken = req.headers.authorization.replace('Bearer ', '');

                if (!accessToken) {
                        return res.status(400).json({
                                message: 'Отсутствует токен доступа',
                        });
                }

                jwt.verify(accessToken, ACCESS, (error, decoded) => {
                        if (!error && decoded?.id) {
                                if (decoded.id == req.params.user_id) {
                                        next();
                                } else {
                                        return res.status(401).json({
                                                message: 'Отсутствуют права доступа к ресурсам указанного пользователя',
                                        });
                                }
                        } else {
                                return res.status(400).json({
                                        message: 'Невалидный токен',
                                });
                        }
                });
        } catch (ex) {
                connection.log(ex, req);

                return res.status(500).json({
                        message: 'Ошибка запроса',
                });
        }
};

export default authMiddleware;
