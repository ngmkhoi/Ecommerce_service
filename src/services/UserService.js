const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            // 🔎 Kiểm tra nếu email đã tồn tại
            const checkUser = await User.findOne({ email: email })
            if (checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại'
                })
            }

            // 🔐 Tạo token
            const refresh_token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
            const access_token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

            const hash = bcrypt.hashSync(password, 10)
            console.log('hash',hash)

            const createdUser = await User.create({
                name,
                email,
                password: hash,
                confirmPassword: hash,
                phone,
                refresh_token,
                access_token
            })

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

module.exports = {
    createUser
}
