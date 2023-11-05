const express = require('express');
const _ = require('lodash');
const { BSON } = require("mongodb");

const router = express.Router();
const dbBlog = require('../db/blog');
const dbSchedule = require("../db/schedule");

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const keyword = req.query.search;
    const results = await dbBlog.all(keyword);

    res.send({
      data: results,
      meta: {
        message: 'success!',
        total: results.length,
        timestamp: new Date()
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500)
    res.send({
      data: {},
      meta: {
        message: e.message,
        timestamp: new Date()
      }
    })
  }
});

module.exports = router;
