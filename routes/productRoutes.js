const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming db.js has SQLite connection and queries

/**
 * Helper function to fetch all products
 */
const getProducts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products'; // Adjust SQL query as per your table schema
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

/**
 * Helper function to fetch a product by ID
 */
const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE id = ?';  // Adjust SQL query as per your table schema
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

/**
 * Helper function to create a new product
 */
const createProduct = (productData) => {
    return new Promise((resolve, reject) => {
        const { name, description, price, imageUrl } = productData;  // Assuming the product data structure
        const query = 'INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)';
        db.run(query, [name, description, price, imageUrl], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, name, description, price, imageUrl });
            }
        });
    });
};

/**
 * Helper function to update a product by ID
 */
const updateProduct = (id, productData) => {
    return new Promise((resolve, reject) => {
        const { name, description, price, imageUrl } = productData;
        const query = 'UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?';
        db.run(query, [name, description, price, imageUrl, id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                resolve(null);  // No product found to update
            } else {
                resolve({ id, name, description, price, imageUrl });
            }
        });
    });
};

/**
 * Helper function to delete a product by ID
 */
const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM products WHERE id = ?';
        db.run(query, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                resolve(null);  // No product found to delete
            } else {
                resolve({ message: 'Product deleted successfully' });
            }
        });
    });
};

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Route to get a product by its ID
router.get('/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Route to create a new product
router.post('/', async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Route to update a product by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
