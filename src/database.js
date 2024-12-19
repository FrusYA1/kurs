import mysql from 'mysql';
import fs from 'node:fs';

const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'messenger',
});

connection.log = (error, req) => {
        fs.appendFileSync('log.txt', `${new Date()}: ${req.url}\n${error.message}\n${error.stack}\n`);
};

connection.connect();

export default connection;
