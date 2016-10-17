'use strict';

const Joi = require('joi');
const Recipe = require('./recipe');


const internals = {
  identity: require('lodash.identity'),
  isPlainObject: require('lodash.isplainobject'),
  isIterable: require('is-iterable')
};

exports.cook = (recipe, ...resolvers) => {

  Recipe.assert(recipe);


  recipe.steps.forEach((step, id) => {

    try {
      step = typeof step === 'function'
        ? step.apply(null, resolvers.map(arg => typeof arg === 'function' ? arg(id) : arg))
        : {};
    } catch (err) {
      throw new Error(`"${recipe.id}" recipe failed at step "${id}": ${err.stack}`)
    }


    if (!internals.isPlainObject(step)) {
      step = {};
    }

    recipe.steps.set(id, step);
  });

  return recipe.cook();
};