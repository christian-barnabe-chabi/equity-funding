var express = require('express');
var router = express.Router();

/**
 * @hideFromApiDocs
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yann Project' });
});

module.exports = router;
