import connection from '../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */

const adminMiddleware = (req, res, next) => {
        try {
                const { user_id, chat_id } = req.params;

                connection.query(
                        {
                                sql: 'SELECT * FROM `chats` WHERE `id` = ? AND `admin_id` = ?',
                                values: [chat_id, user_id],
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
                                                next();
                                        } else {
                                                return res.status(403).json({
                                                        message: 'Чат не существует или вы не являетесь его администратором',
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

export default adminMiddleware;
