const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');
const refreshTokenJwtService = require('../services/jwtService');
const jwtService = require('../services/jwtService');
const mongoose = require('mongoose')


const createUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
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

const loginUser = async (req, res) => {
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
        const response = await UserService.loginUser(req.body);
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

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'ID không tồn tại' 
            });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (err) {
        console.error(`[UPDATE USER] Lỗi khi cập nhật người dùng với ID: ${req.params.id}`, err)
        return res.status(500).json({ 
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình cập nhật người dùng',
            error: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'ID không tồn tại' 
            });
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        console.error(`[DELETE USER] Lỗi khi xoá người dùng với ID: ${req.params.id}`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình xoá người dùng',
            error: e.message
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        console.error(`[GET ALL USER] Lỗi khi lấy danh sách người dùng:`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình lấy danh sách người dùng',
            error: e.message
        });
    }
};

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'ID không tồn tại' 
            });
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        console.error(`[DELETE USER] Lỗi khi sửa thông tin với ID: ${req.params.id}`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình sửa người dùng',
            error: e.message
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]
        if(!token){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'token không tồn tại' 
            });
        }
        const response = await jwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi trong quá trình xử lý refresh token',
            error: e.message
        });
    }
};

module.exports = { createUser, loginUser, updateUser, deleteUser, getAllUser, getDetailUser, refreshToken };
