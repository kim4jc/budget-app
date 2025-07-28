const express = require('express');
const router = express.Router();
const binController = require('../../controllers/binController.js');

router.get('/', binController.getBins);
router.post('/', binController.addBin);
router.delete('/:id', binController.removeBin);

module.exports = router;