const express = require('express');
const router = express.Router();
const dbUser = require('../db/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res) => {
  const result = await dbUser.create(req.body);

  res.send({
    data: result,
    meta: {
      message: 'success',
      statusCode: 201,
    }
  });
});

module.exports = router;
