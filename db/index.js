const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const client = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect () {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = await client.db(process.env.MONGO_DB_NAME)

    await db.createCollection('users');
    await db.createCollection('schedules');
    await db.createCollection('blogs');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
  client,
  connect,
};

