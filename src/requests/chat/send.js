import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const chatSendHandler = (req, res) => {
        try {
                const { user_id, chat_id } = req.params;
                const { message } = req.body;

                if (!user_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор пользователя',
                        });
                }

                if (!chat_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор чата',
                        });
                }

                if (!message) {
                        return res.status(400).json({
                                message: 'Отсутствует текст сообщения',
                        });
                }

                connection.query(
                        {
                                sql: 'SELECT * FROM `chat_user` WHERE `user_id` = ? AND `chat_id` = ?',
                                values: [user_id, chat_id],
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
                                                                        sql: 'INSERT INTO `messages` (`message`) VALUES (?)',
                                                                        values: [message],
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
                                                                                connection.query(
                                                                                        {
                                                                                                sql: 'INSERT INTO `chat_message` (`message_id`, `sender_id`, `chat_id`) VALUES (?, ?, ?)',
                                                                                                values: [results.insertId, user_id, chat_id],
                                                                                        },
                                                                                        (error, results) => {
                                                                                                if (error) {
                                                                                                        connection.rollback();
                                                                                                        connection.log(error, req);

                                                                                                        return res.status(500).json({
                                                                                                                message: 'Ошибка транзакции',
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
                                                                                                                                message: 'Сообщение отправлено',
                                                                                                                                data: {
                                                                                                                                        message_id: results.insertId,
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
                                                return res.status(403).json({
                                                        message: 'Вы не являетесь участником данного чата',
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

export default chatSendHandler;
