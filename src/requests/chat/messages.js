import connection from '../../database.js';
import { validate } from '../../validators/messages.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const chatMessagesHandler = (req, res) => {
        try {
                const { user_id, chat_id } = req.params;

                const count = Number(req.query.count ?? 20);
                const page = Number(req.query.page ?? 0);

                const message = validate(count, page);

                if (message === '') {
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
                                                                        sql: 'SELECT `id`, `sender_id`, `message`, `send_time` FROM `messages` INNER JOIN `chat_message` ON `chat_message`.`message_id` = `messages`.`id` WHERE `chat_id` = ? ORDER BY `send_time` DESC LIMIT ? OFFSET ?',
                                                                        values: [chat_id, count, page * count],
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
                                                                                        message: 'Сообщения получены',
                                                                                        data: results,
                                                                                });
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

export default chatMessagesHandler;
