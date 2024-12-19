import { REFRESH } from '../../config.js';
import connection from '../../database.js';
import { genAccessToken, genRefreshToken } from '../../jwt.js';
import jwt from 'jsonwebtoken';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const refreshHandler = (req, res) => {
        try {
                const { refreshToken } = req.body;

                if (!refreshToken) {
                        return res.status(400).json({
                                message: 'Отсутствует токен в теле запроса',
                        });
                }

                jwt.verify(refreshToken, REFRESH, (error, decoded) => {
                        if (error || !decoded?.accessToken || !decoded?.id) {
                                return res.status(400).json({
                                        message: 'Невалидный обновляющий токен',
                                });
                        } else {
                                const newAccessToken = genAccessToken({ id: decoded.id });
                                const newRefreshToken = genRefreshToken({ id: decoded.id, accessToken: newAccessToken });

                                return res.status(200).json({
                                        message: 'Токены успешно обновлены',
                                        data: {
                                                accessToken: newAccessToken,
                                                refreshToken: newRefreshToken,
                                        },
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

export default refreshHandler;
