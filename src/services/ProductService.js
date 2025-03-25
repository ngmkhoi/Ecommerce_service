const jwt = require('jsonwebtoken')
const Product = require('../models/ProductModel')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const createProduct = async (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct

        try {
            const checkProduct = await Product.findOne({ name: name })
            if (checkProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'Sản phẩm đã tồn tại'
                })
            }

            const newProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            });

            if (newProduct) {
                return resolve({
                    status: 'OK',
                    message: 'Tạo sản phẩm thành công',
                    data: newProduct
                })
            } else {
                return resolve({
                    status: 'ERR',
                    message: 'Không thể tạo sản phẩm, vui lòng thử lại sau'
                })
            }
        } catch (e) {
            console.error('Lỗi trong ProductService:', e)
            return reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình tạo sản phẩm',
                error: e.message
            })
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            console.log(checkProduct)

            if (!checkProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại',
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Cập nhật thành công',
                data: updatedProduct
            })
        } catch (e) {
            console.error('Lỗi trong ProductService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình cập nhật',
                error: e.message
            })
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.isValidObjectId(id)) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không hợp lệ'
                })
            }

            const checkProduct = await Product.findOne({ _id: id })

            if (!checkProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'ID không tồn tại',
                })
            }

            const deletedProduct = await Product.findByIdAndDelete(id)
            if (!deletedProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại hoặc đã bị xoá trước đó'
                })
            }else{
                resolve({
                    status: 'OK',
                    message: 'Xoá sản phẩm thành công'
                })
            }
        } catch (e) {
            console.error('Lỗi trong ProductService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình xoá sản phẩm',
                error: e.message
            })
        }
    })
}

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'Lấy danh sách sản phẩm thành công',
                data: allProduct
            })
        } catch (e) {
            console.error('Lỗi trong ProductService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình lấy danh sách sản phẩm',
                error: e.message
            })
        }
    })
}

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const product = await Product.findOne({ _id: id })

            if (!product) {
                return resolve({
                    status: 'ERR',
                    message: 'sản phẩm không tồn tại',
                })
            }
                resolve({
                    status: 'OK',
                    message: 'thành công',
                    data: product
                })
        } catch (e) {
            console.error('Lỗi trong ProductService:', e)
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi trong quá trình lấy thông tin sản phẩm',
                error: e.message
            })
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct
}
