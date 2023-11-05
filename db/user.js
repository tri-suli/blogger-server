const dotenv = require('dotenv');
const { client} = require("./index");

dotenv.config();

async function create(attributes) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('users');

    const result = await collection.insertOne(attributes);

    return await collection.findOne({ _id: result.insertedId })
  } finally {
    await client.close();
  }
}

module.exports = {
  create
}
