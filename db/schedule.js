const { client} = require("./index");
const user = require('./user');
const {ObjectId} = require("mongodb");


/**
 * Define the schema structure for blogs collection
 *
 * @type {
 *  {
 *    title: string,
 *    content: string
 *    creator: user.Schema,
 *    dob: Date,
 *    updated_at: Date|null,
 *    created_at: Date|null,
 *    deleted_at: Date|null,
 *   }
 * }
 */
const Schema = {
  title: '',
  description: '',
  creator: user.Schema,
  created_at: null,
  updated_at: null,
  deleted_at: null
};

/**
 * Define the schema rules for schedules collection
 *
 * @type {
 *  {
 *    description: {
 *      type: string,
 *      required: boolean
 *    },
 *    title: {
 *      type: string,
 *      min: number,
 *      max: number,
 *      required: boolean
 *    },
 *    creator: {
 *      type: string,
 *      exists: string,
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
 *   }
 *  }
 */
const SchemaRules = {
  title: {
    type: 'string',
    required: true,
    min: 15,
    max: 50,
  },
  description: {
    type: 'string',
    required: true,
  },
  creator: {
    type: 'collection_id',
    required: true,
    exists: 'users:name,email'
  },
  createdAt: {
    type: 'date',
    required: false,
  },
  updatedAt: {
    type: 'date',
    required: false,
  },
  deletedAt: {
    type: 'date',
    required: false,
  }
};

async function create(attributes) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    const result = await collection.insertOne(attributes);

    return await collection.findOne({ _id: result.insertedId })
  } finally {
    await client.close();
  }
}

async function update(attributes, key) {
  try {
    await client.connect();
    const id = new ObjectId(key);
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    const result = await collection.updateOne({
      _id: id
    }, {
      $set: attributes
    });

    return await collection.findOne({ _id: id })
  } finally {
    await client.close();
  }
}

async function findByCreatorAndId(id, creator) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    return await collection.findOne({ _id: new ObjectId(id), creator });
  } finally {
    await client.close();
  }
}

module.exports = {
  create,
  update,
  findByCreatorAndId,
  Schema,
  Rules: SchemaRules
}
