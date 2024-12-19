import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const userInfoHandler = (req, res) => {
        try {
                const { user_id } = req.params;

                if (!user_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор пользователя',
                        });
                }

                connection.query(
                        {
                                sql: 'SELECT `id`, `email`, `firstname`, `lastname`, `creation_date` FROM `users` WHERE `id` = ?',
                                values: [user_id],
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
                                                return res.status(200).json({
                                                        message: 'Пользователь получен',
                                                        data: results[0],
                                                });
                                        } else {
                                                return res.status(404).json({
                                                        message: 'Пользователь не найден',
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

export default userInfoHandler;
