const _ = require('lodash')
const validator = require('validator');
const validation = require('../constants/validation');
const db = require('../db');

const validateUnique = async (collectionName, field, value) => {
  try {
    await db.client.connect();
    // Send a ping to confirm a successful connection
    const collection = await db.client.db(process.env.MONGO_DB_NAME).collection(collectionName)
    const result = await collection.findOne({ [field]: value });

    return result === null;
  } finally {
    await db.client.close();
  }
}

module.exports = async (attributes, rules, fields) => {
  let isValid = true;
  const errors = {};

  for (const field of fields) {
    const messages = [];
    const value = attributes[field];
    const rule = rules[field];

    if (rule.required && _.isEmpty(value)) {
      messages.push(validation.required.replace(':field:', `${field} field`));
    }

    if (value) {
      if (rule.email && !validator.isEmail(value)) {
        messages.push(validation.email.replace(':field:', `${field} field`))
      }

      if (rule.min) {
        let message = '';
        if (_.isString(value) && value.length < rule.min) {
          message = validation.min.string.replace(':field:', `${field} field`);
        } else if (_.isArray(value) && value.length < rule.min) {
          message = validation.min.array.replace(':field:', `${field} field`);
        } else if (_.isNumber(value) && value < rule.min) {
          message = validation.min.numeric.replace(':field:', `${field} field`);
        }

        if (!_.isEmpty(message)) {
          messages.push(message.replace(':min:', rule.min))
        }
      }

      if (rule.max) {
        let message = '';
        if (_.isString(value) && value.length > rule.max) {
          message = validation.max.string.replace(':field:', `${field} field`);
        } else if (_.isArray(value) && value.length > rule.max) {
          message = validation.max.array.replace(':field:', `${field} field`);
        } else if (_.isNumber(value) && value > rule.max) {
          message = validation.max.numeric.replace(':field:', `${field} field`);
        }

        if (!_.isEmpty(message)) {
          messages.push(message.replace(':max:', rule.max))
        }
      }

      if (rule.unique) {
        const isUnique = await validateUnique(rule.unique, field, value);
        if (!isUnique) {
          messages.push(validation.unique.replace(':field:', `${field} field`))
        }
      }
    }

    if (!_.isEmpty(messages)) {
      errors[field] = messages
    }
  }

  if (!_.isEmpty(errors)) {
    isValid = false;
  }

  return {
    isValid,
    errors
  }
}
