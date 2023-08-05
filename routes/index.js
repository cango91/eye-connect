var express = require('express');
var router = express.Router();

/* GET home page. If logged in, take to portal/ if not, the only unrestricted page is /about */
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
