import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const chatUnsendHandler = (req, res) => {
        try {
                const { user_id, chat_id, message_id } = req.params;

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

                if (!message_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор сообщения',
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
                                                                        sql: 'DELETE FROM `chat_message` WHERE `message_id` = ? AND `sender_id` = ? ',
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
                                                                                                        sql: 'DELETE FROM `messages` WHERE `id` = ?',
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

export default chatUnsendHandler;
