'use strict';

const Lab =  require('lab');
const Maite = require('../lib');
const Recipe = require('../lib/recipe');
const {expect} = require('code');
const {describe, it, beforeEach} = exports.lab = Lab.script();

const internals = {};

internals.MyClass = function () {

};

internals.shouldThrow = (fn, input, errorMessage, debug) => {
  try {
    const recipe = fn.apply(null, input);
    expect(recipe).to.not.exist();

  } catch (err) {

    if (debug) {
      console.error(err.stack);
    }

    expect(err).to.exist();
    expect(err.message).to.equals(errorMessage);
  }
};

describe('Recipe', () => {

  const shouldThrow = (input, message) => internals.shouldThrow(Recipe, input, message);

  it('should not create a recipe if "steps" param is invalid', done => {

    shouldThrow([void 0], 'No "steps" param provided');
    shouldThrow([null], 'No "steps" param provided');
    shouldThrow([false], 'No "steps" param provided');
    shouldThrow([true], 'Invalid "steps" param: Must be iterable or a plain object (provided: boolean)');
    shouldThrow([42], 'Invalid "steps" param: Must be iterable or a plain object (provided: number)');
    shouldThrow(['youpla'], 'Invalid "steps" param: Must be iterable or a plain object (provided: string)');
    shouldThrow([internals.MyClass], 'Invalid "steps" param: Must be iterable or a plain object (provided: function)');
    shouldThrow([new internals.MyClass], 'Invalid "steps" param: Must be iterable or a plain object (provided: object)');

    shouldThrow([[void 0]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: undefined)');
    shouldThrow([[null]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: object)');
    shouldThrow([[false]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: boolean)');
    shouldThrow([[true]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: boolean)');
    shouldThrow([[42]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: number)');
    shouldThrow([['youpla']], 'Invalid step n° 1: "step" must be a function or a plain object (provided: string)');
    shouldThrow([[new internals.MyClass]], 'Invalid step n° 1: "step" must be a function or a plain object (provided: object)');


    done();
  });

  it('should not create a recipe if "cook" param is invalid', done => {

    shouldThrow([[], null], 'Invalid "cook" param: Must be a function');
    shouldThrow([[], false], 'Invalid "cook" param: Must be a function');
    shouldThrow([[], true], 'Invalid "cook" param: Must be a function');
    shouldThrow([[], 42], 'Invalid "cook" param: Must be a function');
    shouldThrow([[], 'youpla'], 'Invalid "cook" param: Must be a function');
    shouldThrow([[], new internals.MyClass], 'Invalid "cook" param: Must be a function');

    done();
  });

  it('should create an empty recipe', done => {

    const shouldMakeEmptyRecipe = input => {
      const recipe1 = Recipe(input);

      expect(recipe1).to.be.an.object();
      expect(recipe1.isRecipe).to.equals(true);
      expect(recipe1.steps.size).to.equals(0);
    };

    const myIterable = {};
    myIterable[Symbol.iterator] = function* () {
      yield 1;
      yield 2;
      yield 3;
    };

    shouldMakeEmptyRecipe(new Set);
    shouldMakeEmptyRecipe(new Map);
    shouldMakeEmptyRecipe(myIterable);
    shouldMakeEmptyRecipe([]);
    shouldMakeEmptyRecipe({});

    done();
  });

});

describe('Recipe.from', () => {

  const shouldThrow = (input, message, debug) => internals.shouldThrow(Recipe.from, input, message, debug);

  it('should not create a recipe if "recipes" param is invalid', done => {

    shouldThrow([], 'No "recipes" param provided');
    shouldThrow([0], 'No "recipes" param provided');
    shouldThrow([false], 'No "recipes" param provided');
    shouldThrow([true], 'Invalid "recipes" param: Must be iterable or a plain object (provided: boolean)');
    shouldThrow([42], 'Invalid "recipes" param: Must be iterable or a plain object (provided: number)');
    shouldThrow(['youpla'], 'Invalid "recipes" param: Must be iterable or a plain object (provided: string)');
    shouldThrow([internals.MyClass], 'Invalid "recipes" param: Must be iterable or a plain object (provided: function)');
    shouldThrow([new internals.MyClass], 'Invalid "recipes" param: Must be iterable or a plain object (provided: object)');

    // const recipe = Recipe.from([1]);
    done();
  });

  it('should not create a recipe if "steps" param is invalid', done => {

    shouldThrow([[]], 'No "steps" provided');
    shouldThrow([[], 0], 'No "steps" provided');
    shouldThrow([[], false], 'No "steps" provided');
    shouldThrow([[], true], 'Invalid "steps" param: Must be an Array or a plain object (provided: boolean)');
    shouldThrow([[], 42], 'Invalid "steps" param: Must be an Array or a plain object (provided: number)');
    shouldThrow([[], 'youpla'], 'Invalid "steps" param: Must be an Array or a plain object (provided: string)');
    shouldThrow([[], internals.MyClass], 'Invalid "steps" param: Must be an Array or a plain object (provided: function)');
    shouldThrow([[], new internals.MyClass], 'Invalid "steps" param: Must be an Array or a plain object (provided: object)');

    done();
  });



});

describe('Recipe.from (recipes:Object)', () => {

  const recipes = new Map([
    ['ShadokBis', new Map([
      ['ga', {property: 'zo'}],
      ['meu', {property: 'meu'}]
    ])],
    ['Shadok', new Map([
      ['ga', {property: 'bu'}],
      ['zo', {property: 'meu'}]
    ])]
  ]);

  it('should make a new recipe from existing recipes (steps:Array)', done => {

    const recipe1 = Recipe.from(recipes, [
      'ga:Shadok',
      'meu:ShadokBis',
      'zo:Shadok'
    ]);

    expect(recipe1).to.be.an.object();
    expect(recipe1.isRecipe).to.equals(true);
    expect(recipe1.steps.size).to.equals(3);

    expect(Array.from(recipe1.steps.entries())).to.equals([
      ['ga', {property: 'bu'}],
      ['meu', {property: 'meu'}],
      ['zo', {property: 'meu'}]
    ]);

    done();
  });

  it('should make a new recipe from existing recipes (steps:Object)', done => {
    const recipe = Recipe.from(recipes, {
      ga: 'ShadokBis',
      zo: 'Shadok',
      meu: 'ShadokBis'
    });

    expect(recipe).to.be.an.object();
    expect(recipe.isRecipe).to.equals(true);
    expect(recipe.steps.size).to.equals(3);

    expect(Array.from(recipe.steps.entries())).to.equals([
      ['ga', {property: 'zo'}],
      ['zo', {property: 'meu'}],
      ['meu', {property: 'meu'}]
    ]);

    done();
  });

});

describe('Recipe.from (recipes:Array)', () => {
  let recipes;

  beforeEach(done => {

    recipes = {
      recipe1: [
        {ga: 'bu'},
        ctx => 'zo'
      ],
      recipe2: [
        {ga: 'ga'},
        () => 'meu'
      ]
    };

    done();
  });

  it('should make a new recipe from existing recipes (steps:Array)', done => {


    let recipe = Recipe.from(recipes, [
      '1:recipe2'
    ]);

    expect(recipe).to.be.an.object();
    expect(recipe.isRecipe).to.equals(true);
    expect(recipe.steps.size).to.equals(1);

    let step = recipe.steps.entries().next().value;
    expect(step[0]).to.equals('1');
    expect(step[1]).to.be.a.function();
    expect(step[1]()).to.equals('meu');

    done();
  });

  it('should make a new recipe from existing recipes (steps:Object)', done => {

    let recipe = Recipe.from(recipes, {
      '1': 'recipe1'
    });

    expect(recipe).to.be.an.object();
    expect(recipe.isRecipe).to.equals(true);
    expect(recipe.steps.size).to.equals(1);

    let [key, value] = recipe.steps.entries().next().value;
    expect(key).to.equals('1');
    expect(value).to.be.a.function();
    expect(value()).to.equals('zo');

    done();
  });

});