import connection from '../../database.js';
import { validate } from '../../validators/reg.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const regHandler = (req, res) => {
        try {
                const { firstname, lastname, email, password, passwordConfirm } = req.body;

                if (!firstname || !email || !password || !passwordConfirm) {
                        return res.status(400).json({
                                message: 'Отсутствуют рагистрационные данные',
                        });
                }

                const message = validate(req.body);

                if (message === '') {
                        connection.query(
                                {
                                        sql: 'SELECT `id` FROM `users` WHERE `email` = ?',
                                        values: [email],
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
                                                        return res.status(400).json({
                                                                message: 'Пользователь с данной почтой уже существует',
                                                        });
                                                } else {
                                                        connection.query(
                                                                {
                                                                        sql: 'INSERT INTO `users` (`email`, `firstname`, `lastname`, `password`) VALUES (?, ?, ?, ?)',
                                                                        values: [email, firstname, lastname ?? 'NULL', password],
                                                                        timeout: 10000,
                                                                },
                                                                (error, results) => {
                                                                        if (error) {
                                                                                connection.log(error, req);

                                                                                return res.status(500).json({
                                                                                        message: 'Ошибка запроса к БД',
                                                                                });
                                                                        } else {
                                                                                return res.status(201).json({
                                                                                        message: 'Пользователь создан',
                                                                                        data: {
                                                                                                id: results.insertId,
                                                                                        },
                                                                                });
                                                                        }
                                                                }
                                                        );
                                                }
                                        }
                                }
                        );
                } else {
                        return res.status(400).json({
                                message: message,
                        });
                }
        } catch (ex) {
                connection.log(ex, req);

                return res.status(500).json({
                        message: 'Ошибка запроса',
                });
        }
};

export default regHandler;
