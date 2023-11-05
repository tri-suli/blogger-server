const { Db } = require('mongodb');
const { faker, fa} = require('@faker-js/faker');

const dbSchedule = require('../schedule');
const dbUser = require('../user');
const _ = require("lodash");

const generateSchedule = (userId) => {
  const date = faker.date.anytime().getTime();
  return {
    title: _.capitalize(faker.lorem.words({ min: 5, max: 10 })),
    description: faker.lorem.paragraphs(1),
    date: faker.date.future().getTime(),
    creator: userId,
    createdAt: date,
    updatedAt: date,
    deletedAt: null
  };
}

module.exports = {
  /**
   * Run the collection seeds
   *
   * @param {Db} db
   * @return {Promise<void>}
   */
  async run(db) {
    try {
      await this.flush(db);

      const users = await db.collection(dbUser.name)
        .find({})
        .project({
          _id: 1
        })
        .toArray();

      for (const user of users) {
        await db.collection(dbSchedule.name).insertMany(faker.helpers.multiple(() => generateSchedule(user._id), {
          count: 5
        }));
      }

    } catch (e) {
      console.log(e);
    }
  },

  /**
   * Remove all users record
   *
   * @param {Db} db
   * @return {Promise<void>}
   */
  async flush(db) {
    await db.collection(dbSchedule.name).deleteMany();
  }
}