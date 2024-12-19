import connection from '../../database.js';
import { validate } from '../../validators/create.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const createHandler = (req, res) => {
        try {
                const { user_id } = req.params;
                const { name } = req.body;

                if (!user_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор пользователя',
                        });
                }

                if (!name) {
                        return res.status(400).json({
                                message: 'Отсутствуют название чата',
                        });
                }

                const message = validate(req.body);

                if (message === '') {
                        connection.beginTransaction((error) => {
                                if (error) {
                                        connection.rollback();
                                        connection.log(error, req);

                                        return res.status(500).json({
                                                message: 'Ошибка транзакции',
                                        });
                                }
                                connection.query(
                                        {
                                                sql: 'INSERT INTO `chats` (`admin_id`, `name`) VALUES (?, ?)',
                                                values: [user_id, name],
                                                timeout: 10000,
                                        },
                                        (error, results) => {
                                                if (error) {
                                                        connection.rollback();
                                                        connection.log(error, req);

                                                        return res.status(500).json({
                                                                message: 'Ошибка запроса к БД',
                                                        });
                                                } else {
                                                        const chat = results.insertId;
                                                        connection.query(
                                                                {
                                                                        sql: 'INSERT INTO `chat_user` (`chat_id`, `user_id`) VALUES (?, ?)',
                                                                        values: [results.insertId, user_id],
                                                                        timeout: 10000,
                                                                },
                                                                (error, results) => {
                                                                        if (error) {
                                                                                connection.rollback();
                                                                                connection.log(error, req);

                                                                                return res.status(500).json({
                                                                                        message: 'Ошибка запроса к БД',
                                                                                });
                                                                        } else {
                                                                                connection.commit((error) => {
                                                                                        if (error) {
                                                                                                connection.log(error, req);

                                                                                                return res.status(500).json({
                                                                                                        message: 'Ошибка транзакции',
                                                                                                });
                                                                                        } else {
                                                                                                return res.status(201).json({
                                                                                                        message: 'Чат создан',
                                                                                                        data: {
                                                                                                                id: chat,
                                                                                                        },
                                                                                                });
                                                                                        }
                                                                                });
                                                                        }
                                                                }
                                                        );
                                                }
                                        }
                                );
                        });
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

export default createHandler;
