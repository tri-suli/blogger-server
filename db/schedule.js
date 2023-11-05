const { client} = require("./index");
const user = require('./user');
const {ObjectId} = require("mongodb");
const _ = require("lodash");

const COLLECTION_NAME = 'schedules';

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
    type: String,
    required: true,
    min: 15,
    max: 50,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    after: (new Date()).getTime(),
  },
  creator: {
    type: ObjectId,
    required: true,
    exists: 'users:name,email'
  },
  createdAt: {
    type: Date || null,
    required: false,
  },
  updatedAt: {
    type: Date || null,
    required: false,
  },
  deletedAt: {
    type: Date || null,
    required: false,
  }
};

async function create(attributes) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    const result = await collection.insertOne({
      ...attributes,
      date: (new Date(attributes.date)).getTime()
    });

    return await collection.findOne({ _id: result.insertedId })
  } finally {
    await client.close();
  }
}

async function destroy(key) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    const result = await collection.updateOne({
      _id: new ObjectId(key)
    }, {
      $set: {
        deletedAt: (new Date).getTime()
      }
    });

    return result.modifiedCount === 1;
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
      $set: {
        ..._.omit(attributes, ['_id']),
        date: (new Date(attributes.date)).getTime()
      }
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

async function findByTitleAndDescription(keyword) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection('schedules');

    const match = {
      deletedAt: {
        $eq: null
      }
    }

    if (keyword) {
      match['$or'] = [
        {title: { $regex: keyword, $options: 'i' } },
        {content: { $regex: keyword, $options: 'i' } },
      ];
    }

    return await collection.aggregate([
      {
        $match: match
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          date: 1,
          creator: {
            _id: 1,
            name: 1,
            email: 1
          },
          createdAt: 1,
          updatedAt: 1,
        }
      }
    ]).toArray();
  } finally {
    await client.close();
  }
}

module.exports = {
  name: COLLECTION_NAME,
  create,
  destroy,
  update,
  findByCreatorAndId,
  findByTitleAndDescription,
  Schema,
  Rules: SchemaRules
}
