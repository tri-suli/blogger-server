const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const dbUser = require('../db/user');
const validate = require('../utils/validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  const validator = await validate(
    req.body,
    dbUser.Rules,
    ['name', 'email', 'password']
  );

  if (!validator.isValid) {
    res.status(400);
    res.send({
      data: {
        errors: validator.errors
      },
      meta: {
        message: 'Oops, something wrong with the inputs!',
        timestamp: new Date()
      }
    });
  } else {
    const password = await bcrypt.hash(req.body.password, 10)
    const result = await dbUser.create({
      ...req.body, password
    });

    // Don't return the hashed password
    delete result.password;

    res.status(201);
    res.send({
      data: result,
      meta: {
        message: 'Registration successful!',
        timestamp: new Date()
      }
    });
  }
});

module.exports = router;
