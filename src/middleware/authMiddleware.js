const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers.token;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Token không được cung cấp hoặc không đúng định dạng'
        });
    }

    const token = tokenHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Token không hợp lệ'
            });
        }

        if (!user || typeof user.isAdmin === 'undefined') {
            return res.status(403).json({
                status: 'ERR',
                message: 'Bạn không có quyền truy cập'
            });
        }

        req.user = user; // Gắn payload vào req để các middleware/controller sau có thể dùng
        next();
    });
};

module.exports = { authMiddleware };
