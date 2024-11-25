const Product = require('../models/Product');

exports.getShopPage = (req, res) => {
  Product.getProducts((err, products) => {
    if (err) res.status(500).json({ error: 'Error fetching products' });
    else res.render('shop', { products });
  });
};

exports.addProduct = (req, res) => {
  const product = req.body;
  Product.addProduct(product, (err) => {
    if (err) res.status(500).json({ error: 'Error adding product' });
    else res.redirect('/admin/products');
  });
};
