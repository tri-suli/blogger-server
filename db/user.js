const { client} = require("./index");

const COLLECTION_NAME = 'users';

/**
 * Define the schema structure for users collection
 *
 * @type {
 *  {
 *    name: string,
 *    email: string
 *    password: string,
 *    dob: Date,
 *    createdAt: Date|null,
 *    updatedAt: Date|null,
 *    deletedAt: Date|null,
 *   }
 * }
 */
const Schema = {
  name: '',
  email: '',
  password: '',
  dob: new Date(),
  createdAt: null,
  updatedAt: null,
  deletedAt: null
};

/**
 * Define the schema rules for users collection
 *
 * @type {
 *  {
 *    name: {
 *      unique: string,
 *      type: string,
 *      required: boolean
 *    },
 *    email: {
 *      unique: string,
 *      email: true,
 *      type: string,
 *      required: boolean
 *    },
 *    dob: {
 *      type: string,
 *      required: boolean
 *    },
 *    password: {
 *      max: number,
 *      min: number,
 *      type: string,
 *      required: boolean
 *    },
 *    createdAt: {
 *      type: string,
 *      required: boolean
 *    },
 *    updatedAt: {
 *      type: string,
 *      required: boolean
 *    }
 *    deletedAt: {
 *      type: string,
 *      required: boolean
 *    },
 *  }
 * }
 */
const SchemaRules = {
  name: {
    type: String,
    required: true,
    unique: 'users',
  },
  email: {
    type: String,
    required: true,
    unique: 'users',
    email: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  dob: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date || null,
    required: false,
    nullable: false,
  },
  updatedAt: {
    type: Date,
    required: false,
    nullable: true,
  },
  deletedAt: {
    type: Date,
    required: false,
    nullable: true,
  }
};

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

async function findByNameOrEmail (value) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('users');

    return await collection.findOne({
      $or: [
        { name: value },
        { email: value }
      ]
    });
  } finally {
    await client.close();
  }
}

module.exports = {
  name: COLLECTION_NAME,
  create,
  findByNameOrEmail,
  Schema,
  Rules: SchemaRules
}
