const express = require('express');
const _ = require('lodash');

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

router.patch('/:id', async (req, res) => {
  try {
    const validator = await validate(
      req.body,
      dbSchedule.Rules,
      ['creator', 'title', 'description']
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
      const scheduleId = req.params.id;
      const user = await dbUser.findByNameOrEmail(req.body.creator);
      const schedule = await dbSchedule.findByCreatorAndId(scheduleId, user._id);

      if (!schedule) {
        throw new Error('invalid_user_id')
      }

      const result = await dbSchedule.update({
        ..._.omit(req.body, ['creator']),
        updatedAt: (new Date()).getTime(),
      }, scheduleId);

      res.status(200);
      res.send({
        data: result,
        meta: {
          message: 'Schedule updated successfully!',
          timestamp: new Date()
        }
      });
    }
  } catch (e) {
    if (e.message === 'invalid_user_id') {
      res.status(400);
      res.send({
        data: {
          message: `The user doesn\'t have authorized to update the schedule`,
        },
        meta: {
          message: 'Oops, something wrong with the inputs!',
          timestamp: new Date()
        }
      });
    } else {
      res.status(500)
      res.send({
        data: {},
        meta: {
          message: e.message,
          timestamp: new Date()
        }
      })
    }
  }
});

module.exports = router;
