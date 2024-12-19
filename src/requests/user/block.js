import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const blockHandler = (req, res) => {
        try {
                const { user_id, blocked_id } = req.params;

                if (!user_id || !blocked_id) {
                        return res.status(400).json({
                                message: 'Отсутствуют идентификаторы пользователей',
                        });
                }

                connection.query(
                        {
                                sql: 'SELECT * FROM `blacklist` WHERE `user_id` = ? AND `blocked_user_id` = ?',
                                values: [user_id, blocked_id],
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
                                                        message: 'Пользователь уже заблокирован',
                                                });
                                        } else {
                                                connection.query(
                                                        {
                                                                sql: 'INSERT INTO `blacklist` (`user_id`, `blocked_user_id`) VALUES (?, ?)',
                                                                values: [user_id, blocked_id],
                                                                timeout: 10000,
                                                        },
                                                        (error, results) => {
                                                                if (error) {
                                                                        connection.log(error, req);

                                                                        return res.status(500).json({
                                                                                message: 'Ошибка запроса к БД',
                                                                        });
                                                                } else {
                                                                        return res.status(200).json({
                                                                                message: 'Пользователь заблокирован',
                                                                        });
                                                                }
                                                        }
                                                );
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

export default blockHandler;
