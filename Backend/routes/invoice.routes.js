const express = require('express');
const { generateInvoice, getInvoice } = require('../controllers/invoiceController');

const router = express.Router();

router.get('/generate/:id', generateInvoice);
router.get('/:id', getInvoice);

module.exports = router;