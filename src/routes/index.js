var express = require('express');
var router = express.Router();

/* GET home page. If logged in, take to portal/ if not, the only unrestricted page is /about */
router.get('/', function (req, res, next) {
  if(req.user){
    res.redirect('/portal/');
  }else{
    res.redirect('/about');
  }
});

module.exports = router;
