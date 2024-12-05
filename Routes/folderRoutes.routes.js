const express = require('express');
const { getFolders } = require('../Controllers/folder.controller');

const router = express.Router();

// Fetch folder details route
router.get('/', getFolders);

module.exports = router;
