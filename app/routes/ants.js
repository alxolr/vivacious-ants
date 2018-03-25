var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('ants', { title: 'Ants page' });
});

router.post('/count', (req, res, next) => {
  
});

module.exports = router;
