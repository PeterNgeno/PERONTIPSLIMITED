const db = require('../db');

module.exports = {
  addProduct: (product, callback) => {
    const sql = `INSERT INTO Products (name, price, imageUrl) VALUES (?, ?, ?)`;
    db.run(sql, [product.name, product.price, product.imageUrl], callback);
  },
  getProducts: (callback) => {
    const sql = `SELECT * FROM Products`;
    db.all(sql, [], callback);
  },
};
