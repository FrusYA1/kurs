import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const chatEditHandler = (req, res) => {
        try {
                const { chat_id } = req.params;
                const { name } = req.body;

                if (!chat_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор чата',
                        });
                }

                if (!name) {
                        return res.status(400).json({
                                message: 'Отсутствует название чата',
                        });
                }

                connection.query(
                        {
                                sql: 'UPDATE `chats` SET `name` = ? WHERE `id` = ?',
                                values: [name, chat_id],
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
                                                message: 'Данные чата изменены',
                                                data: {
                                                        id: chat_id,
                                                        name: name,
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

export default chatEditHandler;
