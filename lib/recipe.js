const Hoek = require('hoek');

const internals = {
  isPlainObject: require('lodash.isplainobject'),
  identity: require('lodash.identity'),
  mapify: require('./helpers/mapify')
};

internals.Recipe = module.exports = (steps, cook = internals.identity) => {

  if (!steps) {
    throw new Error('No "steps" param provided');
  }

  try {
    steps = internals.mapify(steps);
  } catch (err) {
    throw new Error(`Invalid "steps" param: ${err.message}`);
  }

  if (typeof cook !== 'function') {
    throw new Error('Invalid "cook" param: Must be a function');
  }

  let i = 0;
  steps.forEach((step, stepId) => {
    i++;

    if (typeof stepId !== 'string') {
      throw new Error(`Invalid step n° ${i}: "stepId" must be a string`);
    }

    if (typeof step !== 'function' && !internals.isPlainObject(step)) {
      throw new Error(`Invalid step n° ${i}: "step" must be a function or a plain object (provided: ${typeof step})`);
    }
  });

  return {
    isRecipe: true,
    steps,
    cook
  };
};

internals.Recipe.from = (recipes, steps) => {

  if (!recipes) {
    throw new Error('No "recipes" param provided');
  }

  try {
    recipes = internals.mapify(recipes);
  } catch (err) {
    throw new Error(`Invalid "recipes" param: ${err.message}`);
  }

  recipes.forEach((recipe, recipeKey) => {

    if (!recipe || !recipe.isRecipe) {
      recipes.set(recipeKey, internals.Recipe(recipe));
    }
  });

  if (!steps) {
    throw new Error('No "steps" provided');
  }

  if (!(steps instanceof Array)) {

    if (!internals.isPlainObject(steps)) {
      throw new Error(`Invalid "steps" param: Must be an Array or a plain object (provided: ${typeof steps})`);
    }

    steps = Object.keys(steps).map(key => `${key}:${steps[key]}`);
  }

  const from = {};

  const recipe = internals.Recipe(steps.reduce((steps, step, i) => {

    if (!step || typeof step !== 'string') {
      throw new Error(`Invalid step n° ${i+1}: Must be a string`)
    }

    const matches = step.trim().match(/^([a-z0-9\-]+:[a-z0-9\-]+)( +as +([a-z0-9\-\.]+))?$/i);
    let alias;

    if (!matches || !matches.length) {
      throw new Error(`Invalid step n° ${i+1}: Bad format (provided: "${step}")`)
    }

    if (matches.length > 1) {
      step = matches[1];

      if (matches.length === 4) {
        alias = matches[3];
      }
    }

    const [stepId, recipeId] = step.split(':');

    const recipe = recipes.get(recipeId);
    if (!recipe) {
      throw new Error(`Invalid step n° ${i+1}: No "${recipeId}" recipe provided`);
    }

    step = recipe.steps.get(stepId);
    if (!step) {
      throw new Error(`Invalid step n° ${i+1}: "${recipeId}" recipe has no "${stepId}" step defined`);
    }

    const key = alias || stepId;
    if (steps.has(key)) {
      throw new Error(`Invalid step n° ${i+1}: "${key}" step is already defined`);
    }

    from[key] = !recipe.from || !recipe.from[stepId] || recipe.from[stepId] === 'self'
      ? recipe
      : recipe.from[stepId];

    steps.set(key, step);

    return steps;
  }, new Map));

  recipe.from = from;

  return recipe;
};

internals.Recipe.assert = input => {

  if (!input || !input.isRecipe) {
    throw new Error('Not a Recipe');
  }

  return input;
};