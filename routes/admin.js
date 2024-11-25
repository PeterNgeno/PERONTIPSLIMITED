const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure for file uploads

// Handle existing product updates
router.post('/admin/update-existing-products', upload.any(), (req, res) => {
  const updatedProducts = req.body.products || [];
  console.log('Updated Products:', updatedProducts);
  res.redirect('/public/admin/manage-products.html');
});

// Handle adding new products
router.post('/admin/add-new-products', upload.any(), (req, res) => {
  const newProducts = req.body.newProducts || [];
  console.log('New Products:', newProducts);
  res.redirect('/public/admin/manage-products.html');
});

module.exports = router;
