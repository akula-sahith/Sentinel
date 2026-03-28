const express = require('express');
const router = express.Router();

const { addNews, getNews } = require('../controllers/newsController');

router.post('/add', addNews);
router.get('/get', getNews);

module.exports = router;