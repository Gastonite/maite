'use strict';

const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.values = input => Object.keys(input).map(key => input[key]);

exports.prepare = (ingredients, mapping) => {

  Joi.assert(ingredients, Joi.object().label('ingredients').required());
  Joi.assert(mapping, Joi.array().label('mapping'));

  let recipe = internals.values(ingredients)
    .reverse()
    .reduce(Hoek.applyToDefaults, {});

  if (mapping) {
    mapping.forEach((value) => {
      const props = value.split('::');
      recipe[props[1]] = ingredients[props[0]][props[1]];
    });
  }

  return recipe;
};

exports.cook = (recipe, params, {initFunc = 'init'} = {}) => {
  Joi.assert(initFunc, Joi.string().label('initFunc'));

  if (initFunc) {
    Joi.assert(recipe[initFunc], Joi.func().required(), 'Invalid "initFunc" option');

    return recipe[initFunc].apply(undefined, params);
  }

  Joi.assert(recipe, Joi.func().required().label('recipe'));

  return recipe.apply(undefined, params);
};
