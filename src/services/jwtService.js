const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// 🔧 Hàm chung để tạo token
const generateToken = (payload, secret, expiresIn) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            console.log('Payload:', payload);
        }
        return jwt.sign(payload, secret, { expiresIn });
    } catch (error) {
        console.error('Lỗi khi tạo token:', error.message);
        throw new Error('Không thể tạo token');
    }
};

const generateAccessToken = (payload) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
    return generateToken(payload, secretKey, '1h');
};

const generateRefreshToken = (payload) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
    return generateToken(payload, secretKey, '31536000s'); // 1 năm
};

//Role chỉ admin mới xoá được tài khoản

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
