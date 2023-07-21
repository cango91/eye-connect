var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    navigation: {
      items: [{
        text: 'Home',
        href: '#',
      },
      {
        text: 'Login',
        href: '#'
      }],
      active: 'Home',
    }
  });
});

module.exports = router;
