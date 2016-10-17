'use strict';

const Lab =  require('lab');
const Maite = require('../lib');
const Recipe = require('../lib/recipe');
const {expect} = require('code');
const {describe, it, beforeEach} = exports.lab = Lab.script();


describe('Maite.cook', () => {
  let fixture;

  beforeEach(done => {

    fixture = new Map([
      ['recipe1', Recipe(new Map([
        ['step1', context => context.zo = 'meu'],
        ['step1', context => context.zo = 'ga']
      ]))]
    ]);

    done();
  });

  it('should cook from one recipe', done => {

    const context = {};
    Maite.cook(fixture.get('recipe1'), context);

    expect(context).to.equals({
      zo: 'ga'
    });

    done();
  });

  it("should call \"cook\" when recipe is complete", done => {
    const cook = () => 'Ga bu zo';

    fixture = Recipe(new Map([
      ['step2', context => context.zo = 'zo']
    ]), cook);

    const context = {};

    expect(Maite.cook(fixture, context)).to.equals('Ga bu zo');
    expect(context).to.equals({
      zo: 'zo'
    });

    done();
  });

  // it('Maite test cook', done => {
  //   fixture.ShadokBis.init = param => {
  //     return 'Ga bu zo ' + param;
  //   };
  //   const recipe = Recipe.from(fixtures);
  //
  //   expect(recipe).to.be.an.object();
  //   expect(recipe.ga).to.equals('bu');
  //   expect(recipe.zo).to.equals('meu');
  //   expect(recipe.meu).to.equals('meu');
  //   expect(Maite.cook(recipe, ['meu'])).to.equals('Ga bu zo meu');
  //   done();
  // });

});
