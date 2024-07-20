const express = require('express');
const router = express.Router();
const uploadsController = require('../controllers/uploads.controller');

router.get('/:nombreArchivo', uploadsController.getArchivo);

module.exports = router;