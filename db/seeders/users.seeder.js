const { Db } = require('mongodb');
const bcrypt = require('bcrypt');
const { faker, fa} = require('@faker-js/faker');

const dbUser = require('../user');

const generateUser = async (firstName, lastName) => {
  const date = faker.date.recent().getTime();
  const password = await bcrypt.hash('secret333', 10);

  return {
    name: faker.internet.userName({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName, provider: 'example.com', allowSpecialCharacters: false }).toLowerCase(),
    dob: faker.date.birthdate({ min: 1970, max: 1999 }).getTime(),
    password,
    createdAt: date,
    updatedAt: date,
    deletedAt: null
  }
};

module.exports = {
  /**
   * Run the collection seeds
   *
   * @param {Db} db
   * @return {Promise<void>}
   */
  async run (db) {
    try {
      await this.flush(db);
      await db.collection(dbUser.name).insertMany([
        await generateUser('Tris', 'Prasetyo'),
        await generateUser('Alex', 'Gottardo'),
        await generateUser('John', 'Doe'),
        await generateUser('John', 'Wick'),
        await generateUser('John', 'Smith'),
      ]);
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
  async flush (db) {
    await db.collection(dbUser.name).deleteMany();
  }
}