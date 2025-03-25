const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });
};

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error('Lỗi xác minh token:', err);
                return resolve({
                    status: 'ERR',
                    message: 'Token không hợp lệ'
                });
            }

            const { id, isAdmin, email } = user;
            const access_token = generateAccessToken({ id, isAdmin, email });

            resolve({
                status: 'OK',
                message: 'Token hợp lệ',
                access_token
            });
        });
    });
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenJwtService
};
