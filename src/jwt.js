import jwt from 'jsonwebtoken';
import { ACCESS, REFRESH } from './config.js';

export const genAccessToken = (data) => {
        return jwt.sign(data, ACCESS, {
                expiresIn: '10m',
        });
};

export const genRefreshToken = (data) => {
        return jwt.sign(data, REFRESH, {
                expiresIn: '1d',
        });
};
