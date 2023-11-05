const { client} = require("./index");
const user = require('./user');

const COLLECTION_NAME = 'blogs';

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
  content: '',
  creator: user.Schema,
  created_at: null,
  updated_at: null,
  deleted_at: null
};

/**
 * Define the schema rules for blogs collection
 *
 * @type {
 *  {
 *    description: {
 *      type: string,
 *      required: boolean
 *    },
 *    title: {
 *      min: number,
 *      max: number,
 *      required: boolean
 *    },
 *    creator: {
 *      type: string,
 *      exists: string[],
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
    max: 20,
  },
  content: {
    type: 'string',
    required: true,
  },
  creator: {
    type: 'collection_id',
    required: true,
    exists: ['users']
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

async function all(keyword) {
  try {
    await client.connect();
    const db = await client.db(process.env.MONGO_DB);
    const collection = await db.collection(COLLECTION_NAME);

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
      { $match: match },
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
          content: 1,
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
  all,
  name: COLLECTION_NAME,
  Schema,
  Rules: SchemaRules
}
