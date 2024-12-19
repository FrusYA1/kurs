import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const userSendHandler = (req, res) => {
        try {
                const { user_id, recipient_id } = req.params;
                const { message } = req.body;

                if (!user_id || !recipient_id) {
                        return res.status(400).json({
                                message: 'Отсутствуют идентификаторы пользователей',
                        });
                }

                if (!message) {
                        return res.status(400).json({
                                message: 'Отсутствует текст сообщения',
                        });
                }

                connection.query(
                        {
                                sql: 'SELECT * FROM `blacklist` WHERE `user_id` = ? AND `blocked_user_id` = ? OR `user_id` = ? AND `blocked_user_id` = ?',
                                values: [recipient_id, user_id, user_id, recipient_id],
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
                                                return res.status(403).json({
                                                        message: 'Вы находитесь в чёрном списке у пользователя, либо он находится в вашем чёрном списке',
                                                });
                                        } else {
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
                                                                                                sql: 'INSERT INTO `user_message` (`message_id`, `sender_id`, `recipient_id`) VALUES (?, ?, ?)',
                                                                                                values: [results.insertId, user_id, recipient_id],
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

export default userSendHandler;
