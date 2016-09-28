'use strict';

const Lab =  require('lab');
const Maite = require('../lib');
const {expect} = require('code');
const {describe, it, beforeEach} = exports.lab = Lab.script();

describe('Maite test', () => {
  let fixtures;

  beforeEach(done => {
    fixtures = {
      Shadoc: {
        ga: 'bu',
        zo: 'meu'
      },
      ShadocBis: {
        ga: 'zo',
        meu: 'meu'
      }
    };
    done();
  });

  it('Maite test mixin', done => {
    const recipe = Maite.prepare(fixtures);

    expect(recipe).to.be.an.object();
    expect(recipe.ga).to.equals('bu');
    expect(recipe.zo).to.equals('meu');
    expect(recipe.meu).to.equals('meu');
    done();
  });

  it('Maite test mixin with overloading', done => {
    const recipe = Maite.prepare(fixtures, [
      'ShadocBis::ga'
    ]);

    expect(recipe).to.be.an.object();
    expect(recipe.ga).to.equals('zo');
    expect(recipe.zo).to.equals('meu');
    expect(recipe.meu).to.equals('meu');
    done();
  });

  it('Maite test cook', done => {
    fixtures.ShadocBis.init = () => {
      return 'Ga bu zo';
    };
    const recipe = Maite.prepare(fixtures);

    expect(recipe).to.be.an.object();
    expect(recipe.ga).to.equals('bu');
    expect(recipe.zo).to.equals('meu');
    expect(recipe.meu).to.equals('meu');
    expect(Maite.cook(recipe)).to.equals('Ga bu zo');
    done();
  });

  it('Maite test cook', done => {
    fixtures.ShadocBis.init = param => {
      return 'Ga bu zo ' + param;
    };
    const recipe = Maite.prepare(fixtures);

    expect(recipe).to.be.an.object();
    expect(recipe.ga).to.equals('bu');
    expect(recipe.zo).to.equals('meu');
    expect(recipe.meu).to.equals('meu');
    expect(Maite.cook(recipe, ['meu'])).to.equals('Ga bu zo meu');
    done();
  });
});
