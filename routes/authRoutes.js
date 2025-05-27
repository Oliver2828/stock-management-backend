// routes/authRoutes.js
const express = require('express');
const router  = express.Router();

const {
  login,
  createWorker,
  createOwner
} = require('../controllers/authController');

const { authenticateOwner } = require('../middleware/authMiddleware');

// Public: create initial Owner (use only once!)
router.post('/create-owner', createOwner);

// Public: login for both Owner & Worker
router.post('/login', login);

// Owner-only: create Worker accounts
router.post('/create-worker', authenticateOwner, createWorker);

module.exports = router;
