const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = reg.test(email);

        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(400).json({ 
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin' 
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({ 
                status: 'ERR',
                message: 'Email không hợp lệ' 
            });
        } else if (password.length < 6) {
            return res.status(400).json({ 
                status: 'ERR',
                message: 'Mật khẩu phải có ít nhất 6 ký tự' 
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({ 
                status: 'ERR',
                message: 'Mật khẩu không khớp' 
            });
        }
        const response = await UserService.createUser(req.body);
        return res.status(201).json(response);

    } catch (err) {
        console.error('Lỗi khi tạo người dùng:', err);
        return res.status(500).json({ 
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình tạo người dùng',
            error: err.message
        });
    }
};

module.exports = { createUser };
