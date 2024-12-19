import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const userUnsendHandler = (req, res) => {
        try {
                const { user_id, recipient_id, message_id } = req.params;

                if (!user_id || !recipient_id) {
                        return res.status(400).json({
                                message: 'Отсутствуют идентификаторы пользователей',
                        });
                }

                if (!message_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор сообщения',
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
                                                                        sql: 'DELETE FROM user_message WHERE message_id = ? AND sender_id = ? ',
                                                                        values: [message_id, user_id],
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
                                                                                if (results.affectedRows > 0) {
                                                                                        connection.query(
                                                                                                {
                                                                                                        sql: 'DELETE FROM messages WHERE id = ?',
                                                                                                        values: [message_id],
                                                                                                },
                                                                                                (error, results) => {
                                                                                                        if (error) {
                                                                                                                connection.rollback();
                                                                                                                connection.log(error, req);

                                                                                                                return res.status(500).json({
                                                                                                                        message: 'Ошибка транзакции',
                                                                                                                });
                                                                                                        } else {
                                                                                                                if (results.affectedRows > 0) {
                                                                                                                        connection.commit((error) => {
                                                                                                                                if (error) {
                                                                                                                                        connection.log(
                                                                                                                                                error,
                                                                                                                                                req
                                                                                                                                        );

                                                                                                                                        return res
                                                                                                                                                .status(500)
                                                                                                                                                .json({
                                                                                                                                                        message: 'Ошибка транзакции',
                                                                                                                                                });
                                                                                                                                } else {
                                                                                                                                        return res
                                                                                                                                                .status(200)
                                                                                                                                                .json({
                                                                                                                                                        message: 'Сообщение удалено',
                                                                                                                                                });
                                                                                                                                }
                                                                                                                        });
                                                                                                                } else {
                                                                                                                        connection.rollback();
                                                                                                                        connection.log(error, req);

                                                                                                                        return res.status(500).json({
                                                                                                                                message: 'Ошибка транзакции',
                                                                                                                        });
                                                                                                                }
                                                                                                        }
                                                                                                }
                                                                                        );
                                                                                } else {
                                                                                        return res.status(404).json({
                                                                                                message: 'Указанное сообщение не существует',
                                                                                        });
                                                                                }
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

export default userUnsendHandler;
