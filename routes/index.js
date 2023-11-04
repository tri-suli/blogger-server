const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    data: {
      title: 'Blogger App'
    },
    meta: {
      message: 'success',
      statusCode: 200,
    }
  });
});

module.exports = router;
