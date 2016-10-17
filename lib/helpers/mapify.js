const Hoek = require('hoek');
const internals = {
  isPlainObject: require('lodash.isplainobject'),
  isIterable: require('is-iterable')
};

module.exports = input => {

  if (!input) {
    throw new Error('Nothing to mapify');
  }

  if (internals.isPlainObject(input)) {
    return new Map(Object.keys(input).map(k => [k, input[k]]));
  }

  if (typeof input === 'string' || !internals.isIterable(input)) {
    throw new Error(`Must be iterable or a plain object (provided: ${typeof input})`);
  }

  if (!(input instanceof Map)) {

    if (!(input instanceof Array)) {
      input = Array.from(input);
    }

    input = new Map(input.map((v, i) => [''+i, v]));
  }
  return input;
};