const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const extractToken = (req) => {
    const tokenHeader = req.headers.token;
    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) return null;
    return tokenHeader.split(' ')[1];
};

const authMiddleware = (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Token không được cung cấp hoặc không đúng định dạng'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || !user) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Token không hợp lệ'
            });
        }

        if (typeof user.isAdmin === 'undefined') {
            return res.status(403).json({
                status: 'ERR',
                message: 'Bạn không có quyền truy cập'
            });
        }

        req.user = user; // Gắn payload vào req để các middleware/controller sau có thể dùng
        return next();
    });
};

const authUserMiddleware = (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({
            status: 'ERR',
            message: 'Token không được cung cấp hoặc không đúng định dạng'
        });
    }

    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || !user) {
            return res.status(403).json({
                status: 'ERR',
                message: 'Token không hợp lệ'
            });
        }

        if (user.isAdmin || user.id == userId) {
            return next();
        } else {
            return res.status(403).json({
                status: 'ERR',
                message: 'Bạn không có quyền truy cập'
            });
        }
    });
};

module.exports = { authMiddleware, authUserMiddleware };
