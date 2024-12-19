import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const addHandler = (req, res) => {
        try {
                const { chat_id, added_id } = req.params;

                if (!added_id) {
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
                                sql: 'INSERT INTO `chat_user` (`user_id`, `chat_id`) VALUES (?, ?)',
                                values: [added_id, chat_id],
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
                                                message: 'Пользователь добавлен в чат',
                                                data: {
                                                        user_id: added_id,
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

export default addHandler;
