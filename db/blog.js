const dotenv = require('dotenv');
const { client} = require("./index");
const user = require('./user');

dotenv.config();

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
    min: 15,
    max: 50,
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

module.exports = {
  Schema,
  Rules: SchemaRules
}
