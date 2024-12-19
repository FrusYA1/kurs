import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const chatInfoHandler = (req, res) => {
        try {
                const { user_id, chat_id } = req.params;

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
                                                                                connection.query(
                                                                                        {
                                                                                                sql: 'SELECT `id`, `admin_id`, `name`, `creation_date` FROM `chats` WHERE `id` = ?',
                                                                                                values: [chat_id],
                                                                                                timeout: 10000,
                                                                                        },
                                                                                        (error, results) => {
                                                                                                if (error) {
                                                                                                        connection.log(error, req);

                                                                                                        return res.status(500).json({
                                                                                                                message: 'Ошибка запроса к БД',
                                                                                                        });
                                                                                                } else {
                                                                                                        const chat = results[0];

                                                                                                        connection.query(
                                                                                                                {
                                                                                                                        sql: 'SELECT `users`.`id`, `users`.`email`, `users`.`firstname`, `users`.`lastname`, `users`.`creation_date` FROM `chats` INNER JOIN `chat_user` ON `chat_user`.`chat_id` = `chats`.`id` INNER JOIN `users` ON `users`.`id` = `chat_user`.`user_id` WHERE `chats`.`id` = ? ',
                                                                                                                        values: [chat_id],
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
                                                                                                                                        message: 'Информация о чате получена',
                                                                                                                                        data: Object.assign(
                                                                                                                                                chat,
                                                                                                                                                {
                                                                                                                                                        members: results,
                                                                                                                                                }
                                                                                                                                        ),
                                                                                                                                });
                                                                                                                        }
                                                                                                                }
                                                                                                        );
                                                                                                }
                                                                                        }
                                                                                );
                                                                        } else {
                                                                                return res.status(403).json({
                                                                                        message: 'Чат отсутствует или вы не являетесь участником чата',
                                                                                });
                                                                        }
                                                                }
                                                        }
                                                );
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

export default chatInfoHandler;
