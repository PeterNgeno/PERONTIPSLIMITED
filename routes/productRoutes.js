const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Route to get all products
router.get('/', getProducts);

// Route to get a product by its ID
router.get('/:id', getProductById);

// Route to create a new product
// Example: Accessible only to admins
router.post('/', createProduct);

// Route to update a product by ID
router.put('/:id', updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
