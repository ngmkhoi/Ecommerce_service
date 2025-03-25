const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body;

        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(400).json({ 
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin' 
            });
        }
        const response = await ProductService.createProduct(req.body);
        return res.status(201).json(response);
    } catch (err) {
        console.error('Lỗi khi tạo sản phẩm:', err);
        return res.status(500).json({ 
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình tạo sản phẩm',
            error: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'ID không tồn tại' 
            });
        }
        const response = await ProductService.updateProduct(productId, data);
        return res.status(200).json(response);
    } catch (err) {
        console.error(`[UPDATE PRODUCT] Lỗi khi cập nhật sản phẩm với ID: ${req.params.id}`, err)
        return res.status(500).json({ 
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình cập nhật sản phẩm',
            error: err.message
        })
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'ID không tồn tại' 
            });
        }
        const response = await ProductService.getDetailProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        console.error(`[DETAIL PRODUCT] Lỗi khi lấy thông tin với ID: ${req.params.id}`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng',
            error: e.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if(!productId){
            return res.status(400).json({ 
                status: 'ERR',
                message: 'sản phẩm không tồn tại' 
            });
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        console.error(`[DELETE PRODUCT] Lỗi khi xoá sản phẩm với ID: ${req.params.id}`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình xoá sản phẩm',
            error: e.message
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const response = await ProductService.getAllProduct();
        return res.status(200).json(response);
    } catch (e) {
        console.error(`[GET ALL PRODUCT] Lỗi khi lấy danh sách sản phẩm:`, e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi trong quá trình lấy danh sách sản phẩm',
            error: e.message
        });
    }
};

module.exports = { createProduct, updateProduct, getDetailProduct, deleteProduct, getAllProduct };
