const express = require('express');
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const {authMiddleware } = require('../middleware/authMiddleware');

router.post('/create',authMiddleware ,ProductController.createProduct)
router.put('/update-product/:id',authMiddleware, ProductController.updateProduct);
router.delete('/delete-product/:id',authMiddleware, ProductController.deleteProduct);
router.get('/get-details/:id', ProductController.getDetailProduct);
router.get('/get-all', ProductController.getAllProduct);


module.exports = router