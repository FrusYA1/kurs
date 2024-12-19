import connection from '../database.js';

/**
 *
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction} next
 */
const testHandler = (req, res) => {
        try {
                connection.query(
                        {
                                sql: "SELECT 'Hello world' AS `message`",
                                timeout: 10000,
                        },
                        (error, results) => {
                                if (error) {
                                        connection.log(ex, req);

                                        return res.status(500).json({
                                                message: 'Ошибка запроса к БД',
                                        });
                                } else {
                                        return res.status(200).json(results[0]);
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

export default testHandler;
