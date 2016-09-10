'use strict';

const internals = {};

internals.mixer = (source, target) => {
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      target[property] = source[property];
    }
  }
  return target;
};

internals.createReicpe = (ingredients) => {
  const items = Object.keys(ingredients).map(key => ingredients[key]);

  return  items.reverse().reduce((target, source) => internals.mixer(source, target));
};

module.exports.prepare = (ingredients, mapping) => {
  let recipe = internals.createReicpe(ingredients);

  mapping.forEach((value) => {
    const props = value.split('::');
    recipe[props[1]] = ingredients[props[0]][props[1]];
  });

  return recipe;
};

module.exports.cook = (recipe, params) => {
  return recipe.apply(undefined, params);
};
