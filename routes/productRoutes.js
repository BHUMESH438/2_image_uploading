const { getAllproduct, createProduct } = require('../controllers/productController');
const { uploadProductImage } = require('../controllers/uploadsController');
const express = require('express');
const router = express.Router();

router.route('/').post(createProduct).get(getAllproduct);
router.route('/uploads').post(uploadProductImage);

module.exports = router;
