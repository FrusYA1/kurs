import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const kickHandler = (req, res) => {
        try {
                const { chat_id, kicked_id } = req.params;

                if (!kicked_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор пользователя',
                        });
                }

                if (!chat_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор чата',
                        });
                }

                connection.query(
                        {
                                sql: 'DELETE FROM `chat_user` WHERE `user_id` = ? AND `chat_id` = ?',
                                values: [kicked_id, chat_id],
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
                                                message: 'Пользователь удалён из чата',
                                                data: {
                                                        user_id: kicked_id,
                                                        chat_id: chat_id,
                                                },
                                        });
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

export default kickHandler;
