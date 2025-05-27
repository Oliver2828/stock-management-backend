const Category  = require('../models/Category');
const Supplier  = require('../models/Supplier');
const StockItem = require('../models/StockItem');

/**
 * GET /api/stock/categories
 * Returns an array of category names for the dropdown.
 */
// controllers/stockController.js

exports.getCategories = async (req, res, next) => {
    try {
      const cats = await Category.find().sort('name');
      res.json(cats); // ✅ Return full category objects
    } catch (err) {
      next(err);
    }
  };
  
/**
 * GET /api/stock/suppliers
 * Returns an array of supplier objects: [{ id, name }, ...]
 */
exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort('name');
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/stock
 * Lists all stock items, with populated category and supplier.
 */
exports.listStockItems = async (req, res, next) => {
  try {
    const items = await StockItem.find()
      .populate('category', 'name')
      .populate('supplier', 'name');
    res.json(items);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/stock
 * Adds a new stock item.
 * Body should include:
 *   { name, barcode, category, supplier, price, cost, quantity, minStockLevel, expiryDate }
 */
exports.addStockItem = async (req, res, next) => {
    try {
      const {
        name,
        barcode,
        category: categoryName,
        supplier: supplierId,
        price,
        cost,
        quantity,
        minStockLevel,
        expiryDate
      } = req.body;
  
      // 1. Find or create the Category
      let category = await Category.findOne({ name: categoryName.trim() });
      if (!category) {
        category = await Category.create({ name: categoryName.trim() });
      }
  
      // 2. Validate supplier if provided
      let supplier = null;
      if (supplierId) {
        supplier = await Supplier.findById(supplierId);
        if (!supplier) {
          return res.status(400).json({ message: 'Invalid supplier ID' });
        }
      }
  
      // 3. Create the StockItem
      const createdItem = await StockItem.create({
        name:          name.trim(),
        barcode:       barcode?.trim(),
        category:      category._id,
        supplier:      supplier?._id || undefined,
        price:         Number(price),
        cost:          Number(cost),
        quantity:      Number(quantity),
        minStockLevel: Number(minStockLevel),
        expiryDate:    expiryDate ? new Date(expiryDate) : undefined
      });
  
      // ✅ 4. Re-fetch and populate category and supplier
      const item = await StockItem.findById(createdItem._id)
        .populate('category', 'name')
        .populate('supplier', 'name');
  
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  };
  