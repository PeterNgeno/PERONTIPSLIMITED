const Product = require('../models/Product'); // Assuming Product model is set up with MongoDB

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.status(200).json(products); // Ensure status is 200 for successful fetch
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id); // Find product by ID
    if (product) {
      res.status(200).json(product); // Return the product with a 200 status
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Product name and price are required' });
  }
  try {
    const newProduct = new Product({ name, price });
    await newProduct.save(); // Save product to MongoDB
    res.status(201).json(newProduct); // Created status (201)
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name && !price) {
    return res.status(400).json({ message: 'At least one field (name or price) is required for update' });
  }
  try {
    const product = await Product.findById(id); // Find product by ID
    if (product) {
      product.name = name || product.name; // Update fields if provided
      product.price = price || product.price;
      await product.save(); // Save updated product
      res.status(200).json(product); // Return the updated product
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id); // Find product by ID
    if (product) {
      await product.remove(); // Delete product from MongoDB
      res.status(204).send(); // No content response for successful delete
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
