const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const { generateAccessToken, generateRefreshToken } = require('../services/jwtService')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const createUser = async (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword } = newUser

        try {
            const checkUser = await User.findOne({ email })
            if (checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại'
                })
            }

            if (password !== confirmPassword) {
                return resolve({
                    status: 'ERR',
                    message: 'Mật khẩu xác nhận không khớp'
                })
            }

            const hash = bcrypt.hashSync(password, 10)

            // 🔒 Tạo access_token và refresh_token
            const access_token = generateAccessToken({ email })
            const refresh_token = generateRefreshToken({ email })
            

            const createdUser = await User.create({
                name,
                email,
                password: hash,
                access_token, 
                refresh_token  
            });

            if (createdUser) {
                return resolve({
                    status: 'OK',
                    message: 'Tạo tài khoản thành công',
                    data: createdUser
                })
            } else {
                return resolve({
                    status: 'ERR',
                    message: 'Không thể tạo tài khoản, vui lòng thử lại sau'
                })
            }
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            return reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình tạo tài khoản',
                error: e.message
            })
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({ email })
            if (!checkUser) {
                return resolve({ status: 'ERR', message: 'Email không tồn tại' })
            }

            const comparePassword = await bcrypt.compare(password, checkUser.password)
            if (!comparePassword) {
                return resolve({ status: 'ERR', message: 'Mật khẩu không đúng' })
            }

            // 🔐 Tạo Access Token và Refresh Token
            let access_token, refresh_token
            try {
                access_token = await generateAccessToken({
                    id: checkUser.id,
                    isAdmin: checkUser.isAdmin,
                    email: checkUser.email
                })

                refresh_token = await generateRefreshToken({
                    id: checkUser.id,
                    isAdmin: checkUser.isAdmin,
                    email: checkUser.email
                })
            } catch (tokenError) {
                console.error('Lỗi khi tạo token:', tokenError)
                return reject({
                    status: 'ERR',
                    message: 'Đã xảy ra lỗi khi tạo token',
                    error: tokenError.message
                })
            }

            resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                access_token,
                refresh_token,
            })
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình đăng nhập',
                error: e.message
            })
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log(checkUser)

            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không tồn tại',
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Cập nhật thành công',
                data: updatedUser
            })
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình cập nhật',
                error: e.message
            })
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.isValidObjectId(id)) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không hợp lệ'
                })
            }

            const checkUser = await User.findOne({ _id: id })

            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không tồn tại',
                })
            }

            const deletedUser = await User.findByIdAndDelete(id)
            if (!deletedUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Người dùng không tồn tại hoặc đã bị xoá trước đó'
                })
            }else{
                resolve({
                    status: 'OK',
                    message: 'Xoá người dùng thành công'
                })
            }
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình xoá người dùng',
                error: e.message
            })
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Lấy danh sách người dùng thành công',
                data: allUser
            })
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình lấy danh sách người dùng',
                error: e.message
            })
        }
    })
}

const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const user = await User.findOne({ _id: id })

            if (!user) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không tồn tại',
                })
            }
                resolve({
                    status: 'OK',
                    message: 'thành công',
                    data: user
                })
        } catch (e) {
            console.error('Lỗi trong UserService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng',
                error: e.message
            })
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}
