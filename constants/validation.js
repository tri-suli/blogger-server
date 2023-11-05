/**
 * Invalid message for input date.
 *
 * @type {string}
 */
const date = 'The :field: field must be a valid date.';

/**
 * Invalid message for input email.
 *
 * @type {string}
 */
const email = 'The :field: field must be a valid email address.';

/**
 * Invalid message input for rules max.
 *
 * @type {{['array'|'file'|'numeric'|'string']: string}}
 */
const max = {
  array: 'The :field: field must not have more than :max: items.',
  file: 'The :field: field must not be greater than :max: kilobytes.',
  numeric: 'The :field: field must not be greater than :max:.',
  string: 'The :field: field must not be greater than :max: characters.',
};

/**
 * Invalid message input for rules max.
 *
 * @type {{['array'|'file'|'numeric'|'string']: string}}
 */
const min = {
  array: 'The :field: field must have at least :min: items.',
  file: 'The :field: field must be at least :min: kilobytes.',
  numeric: 'The :field: field must be at least :min:.',
  string: 'The :field: field must be at least :min: characters.',
};

/**
 * Invalid message for input rule required.
 *
 * @type {string}
 */
const required = 'The :field: is required';

/**
 * Invalid message for input rule unique.
 *
 * @type {string}
 */
const unique = 'The :field: has already been taken.';

module.exports = {
  date,
  email,
  max,
  min,
  required,
  unique
}