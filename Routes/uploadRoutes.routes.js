const express = require('express');
const multer = require('multer');
const { uploadDataset } = require('../Controllers/upload.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload route
router.post('/', upload.single('file'), uploadDataset);

module.exports = router;
