import connection from '../../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
const userEditHandler = (req, res) => {
        try {
                const { user_id } = req.params;
                const { email, firstname, lastname, password } = req.body;

                if (!user_id) {
                        return res.status(400).json({
                                message: 'Отсутствует идентификатор пользователя',
                        });
                }

                if (!email || !firstname || !password) {
                        return res.status(400).json({
                                message: 'Отсутствует email, имя и пароль пользователя',
                        });
                }

                connection.query(
                        {
                                sql: 'UPDATE `users` SET `email` = ?, `firstname` = ?, `lastname` = ?, `password` = ? WHERE `id` = ?',
                                values: [email, firstname, lastname ?? 'NULL', password, user_id],
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
                                                message: 'Данные пользователя изменены',
                                                data: {
                                                        id: user_id,
                                                        email: email,
                                                        firstname: firstname,
                                                        lastname: lastname,
                                                        password: password,
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

export default userEditHandler;
