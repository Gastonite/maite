'use strict';

const Hoek = require('hoek');

const internals = {};

internals.createReicpe = (ingredients) => {
  const items = Object.keys(ingredients).map(key => ingredients[key]);
  items.push({});

  return  items.reverse().reduce((target, source) => Hoek.applyToDefaults(target, source));
};

module.exports.prepare = (ingredients, mapping) => {
  let recipe = internals.createReicpe(ingredients);

  if (mapping) {
    mapping.forEach((value) => {
      const props = value.split('::');
      recipe[props[1]] = ingredients[props[0]][props[1]];
    });
  }

  return recipe;
};

module.exports.cook = (recipe, params, constProp) => {
  if (constProp) {
    return recipe[constProp].apply(undefined, params);
  }
  return recipe.apply(undefined, params);
};
