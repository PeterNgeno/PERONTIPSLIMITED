const db = require('../db');

// Function to add a product to the SQLite database
module.exports = {
  addProduct: (product, callback) => {
    const sql = `INSERT INTO Products (name, price, imageUrl) VALUES (?, ?, ?)`;
    db.run(sql, [product.name, product.price, product.imageUrl], function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, ...product }); // Return inserted product with id
      }
    });
  },

  // Function to get all products from the SQLite database
  getProducts: (callback) => {
    const sql = `SELECT * FROM Products`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows); // Return all products
      }
    });
  },

  // Function to get a product by its ID
  getProductById: (productId, callback) => {
    const sql = `SELECT * FROM Products WHERE id = ?`;
    db.get(sql, [productId], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row); // Return the single product
      }
    });
  },

  // Function to update a product by ID
  updateProduct: (productId, updatedProduct, callback) => {
    const sql = `UPDATE Products SET name = ?, price = ?, imageUrl = ? WHERE id = ?`;
    db.run(sql, [updatedProduct.name, updatedProduct.price, updatedProduct.imageUrl, productId], function (err) {
      if (err) {
        callback(err, null);
      } else if (this.changes === 0) {
        callback(null, null); // No product was updated
      } else {
        callback(null, { id: productId, ...updatedProduct });
      }
    });
  },

  // Function to delete a product by ID
  deleteProduct: (productId, callback) => {
    const sql = `DELETE FROM Products WHERE id = ?`;
    db.run(sql, [productId], function (err) {
      if (err) {
        callback(err, null);
      } else if (this.changes === 0) {
        callback(null, null); // No product was deleted
      } else {
        callback(null, { message: 'Product deleted successfully' });
      }
    });
  },
};
