const express = require('express');
const router = express.Router();
const dbSchedule = require('../db/schedule');
const dbUser = require('../db/user');
const validate = require('../utils/validator');

/* GET users listing. */
router.get('/', function(req, res, next) {

});

router.post('/', async (req, res) => {
  const validator = await validate(
    req.body,
    dbSchedule.Rules,
    ['title', 'description', 'creator']
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
    const user = await dbUser.findByNameOrEmail(req.body.creator);
    const result = await dbSchedule.create({
      ...req.body,
      creator: user._id,
      createdAt: (new Date()).getTime(),
      updatedAt: null,
      deletedAt: null,
    });

    res.status(201);
    res.send({
      data: result,
      meta: {
        message: 'Schedule created successfully!',
        timestamp: new Date()
      }
    });
  }
});

module.exports = router;
