import connection from '../../database.js';
import { genAccessToken, genRefreshToken } from '../../jwt.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const authHandler = (req, res) => {
        try {
                const { email, password } = req.body;

                if (!email || !password) {
                        return res.status(400).json({
                                message: 'Отсутствуют авторизационные данные',
                        });
                }

                connection.query(
                        {
                                sql: 'SELECT `id` FROM `users` WHERE `email` = ? AND `password` = md5(CONCAT(?, "c5262e"))',
                                values: [email, password],
                                timeout: 10000,
                        },
                        (error, results) => {
                                if (error) {
                                        connection.log(error, req);

                                        return res.status(500).json({
                                                message: 'Ошибка запроса к БД',
                                        });
                                } else {
                                        if (results.length > 0) {
                                                const accessToken = genAccessToken({ id: results[0].id });
                                                const refreshToken = genRefreshToken({ id: results[0].id, accessToken: accessToken });

                                                return res.status(200).json({
                                                        message: 'Авторизация прошла успешно',
                                                        data: {
                                                                id: results[0].id,
                                                                jwt: {
                                                                        accessToken: accessToken,
                                                                        refreshToken: refreshToken,
                                                                },
                                                        },
                                                });
                                        } else {
                                                return res.status(400).json({
                                                        message: 'Неправильный логин/пароль',
                                                });
                                        }
                                }
                        }
                );
        } catch (ex) {
                connection.log(ex, req);

                return res.status(500).json({
                        message: 'Ошибка запроса',
                });
        }
};

export default authHandler;
