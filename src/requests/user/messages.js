import connection from '../../database.js';
import { validate } from '../../validators/messages.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const userMessagesHandler = (req, res) => {
        try {
                const { user_id, contact_id } = req.params;

                const count = Number(req.query.count ?? 20);
                const page = Number(req.query.page ?? 0);

                const message = validate(count, page);

                if (message === '') {
                        connection.query(
                                {
                                        sql: 'SELECT `id`, `sender_id`, `recipient_id`, `message`, `send_time` FROM `messages` INNER JOIN `user_message` ON `user_message`.`message_id` = `messages`.`id` WHERE `sender_id` = ? AND `recipient_id` = ? OR `sender_id` = ? AND `recipient_id` = ? ORDER BY `send_time` DESC LIMIT ? OFFSET ?',
                                        values: [user_id, contact_id, contact_id, user_id, count, page * count],
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

export default userMessagesHandler;
