const express = require('express');
const router  = express.Router();

const stockCtrl = require('../controllers/stockController');
const { auth, restrictTo } = require('../middleware/auth');

// all stock routes require a valid JWT
router.use(auth);

// dropdown data
router.get('/categories', stockCtrl.getCategories);
router.get('/suppliers',  stockCtrl.getSuppliers);

// list and add stock items
router.get('/', stockCtrl.listStockItems);

// only owners/admins can add new items
router.post('/', restrictTo('owner', 'worker'), stockCtrl.addStockItem);

module.exports = router;
