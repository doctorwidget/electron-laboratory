/**
 * Unit tests for counter-related sagas
 *
 * Note the lack of any imports like {expect, it, describe ...}
 * The idea is that you only run your tests _through_ Jest,
 * (e.g. `jest path/to/testFile` or just `jest`). That means Jest
 * is free to pollute the global namespace to its hearts content.
 *
 * Depends on the {jest-extended} package, for more succinct matchers:
 * https://github.com/jest-community/jest-extended
 *
 * NB: see https://devhints.io/jest
 *
 */
import { delay } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import * as sagas from '../../app/sagas/counter'; // our sagas-to-be-tested
import * as actions from '../../app/actions/counter'; // needed to generate test values

// this incantation lets us test the delay effect easily -- perhaps too easily (?)
// otherwise we are in a world of pain trying to compare nested promises
// jest.mock('redux-saga');  // delay returns _undefined_ when we do this... too weird!

describe('counter sagas', () => {
  it('seems to be sane', () => {
    expect(null).toBeFalsy();
    expect(1).toBeTruthy();
  });

  // our doIncrement _worker_ saga is just a demonstration that we can
  // listen to any action type, even if we're not the intended recipient
  // That makes this test super simple -- there's nothing to test but {delay}
  // (and {delay} is surprisingly irritating to test in and of itself!)
  describe('the doIncrement worker saga', () => {
    const saga = sagas.doIncrement();

    it('returns the expected Effect for the first call', async () => {
      const next = saga.next();
      const actual = next.value; // an Effect object: {'@@redux-saga/CANCEL_PROMISE': [[Promise Object]]}
      const expected = delay(1, 1);

      // it seems like confirming the keys are equal is at least as useful as mocking {delay}
      expect(Object.keys(actual)).toEqual(Object.keys(expected));
    });

    it('returns a standard done object `{done:true, value:undefined}` if called again', () => {
      // here we check both values
      expect(saga.next()).toEqual({ done: true, value: undefined });
    });
  });

  // similarly straightforward testing for doDecrement, just more terse
  describe('the doDecrement worker saga', () => {
    const saga = sagas.doDecrement();

    it('returns the expected Effect for the first call', () => {
      const actual = Object.keys(saga.next().value);
      const expected = Object.keys(delay(1, 1));
      expect(actual).toEqual(expected);
    });

    it('returns a standard done object `{done:true, value:undefined}` if called again', () => {
      expect(saga.next()).toEqual({ done: true, value: undefined });
    });
  });

  // SUPER IMPORTANT QUESTION: How do I mock app state, if my saga depends on the use of {select}?
  // !!: the ability to pass values INTO generators is the magic trick that lets you mock state
  describe('the doIncrementIfEven worker saga', () => {
    // the resutl of the first next should be identical to a call to select() with no arguments
    // if the saga-under-test took an actual selector fn as arg #1, we would have to send it here too
    // but since our saga-under-test takes nothing, our {expected} value must also take nothing
    it('emits an increment action if the app counter state is even', () => {
      const saga = sagas.doIncrementIfEven(); // paused at position 0, well before the first yield

      expect(saga.next().value).toEqual(select()); // both will be an Effect telling redux-saga to call select()
      // nb: IF the worker saga called select(selectorFn), our test here would also need select(selectorFn)

      // now the magic trick!  I am surprised this isn't part of an official tutorial somwwhere
      // on the subsequent call to next(), we pass a value _in_
      // the value we pass _in_ becomes the value to the left of the {yield} statement
      // This is one of the core superpowers of generators!!
      const actual = saga.next({ counter: 2 }).value; // !!... no need for some elaborate state-mocking function!
      const expected = put(actions.increment()); //  we expect a new action to be emitted
      expect(actual).toEqual(expected); // so here we test for it

      // confirm that this saga is done as of next() call #3
      expect(saga.next()).toEqual({ done: true, value: undefined });
    });

    it('is {.done} after the first step if the app counter state is odd', () => {
      const saga = sagas.doIncrementIfEven(); // paused at position 0, well before the first yield

      expect(saga.next().value).toEqual(select());

      // !! same magic trick, but this time we pass in {counter: 5} ... this is our mock app state!
      const actual = saga.next({ counter: 5 }); // and this time we don't home in on {.value} right away
      const expected = { done: true, value: undefined }; // because we want to compare to a full {.done} object
      expect(actual).toEqual(expected);

      //  this time we are done after 2 calls to next instead of 3, exactly as expected
    });

    // and that's it!
    // There is no need for mock functions, utility functions, or extra libraries
    // Generators are _made to be mocked_, because of the ability to pass values *in*
    // This is why people say {redux-saga} is highly testable right out of the box.
  });

  // cloneableGenerator
  // redux-saga offers a utility called cloneableGenerator to cut down on boilerplate even further
  // it lets you do the _setup_ for a series of tests just once, after which you can spin off
  // any number of clones from the cloneableGenerator. Each new clone will have the same state
  // that the original was in at the point of cloning. This makes testing branching behavior
  // in the later stages much simpler.
  describe('the doIncrementIfOdd worker saga', () => {
    // create the cloneable generator. NB: we pass in the saga _function_, not a saga _instance
    const originalSaga = cloneableGenerator(sagas.doIncrementIfOdd)();

    // move the original saga one step forward in its cycle, and test that result
    expect(originalSaga.next().value).toEqual(select()); // all tests would repeat this test otherwise

    it('emits an increment action if the app counter state is odd', () => {
      const saga = originalSaga.clone(); // cloned saga has same internal state as originalSaga

      const actual = saga.next({ counter: 11 }).value; // 11 is odd, so we expect an increment
      const expected = put(actions.increment());
      expect(actual).toEqual(expected); // so here we test for it

      // confirm that this saga is done as of next() call #3
      expect(saga.next()).toEqual({ done: true, value: undefined });
    });

    it('is {.done} after the first step if the app counter state is even', () => {
      const saga = originalSaga.clone(); // a different clone, but with the same internal state
      const actual = saga.next({ counter: -2 }); // -2 is even, so we expect the saga to end
      const expected = { done: true, value: undefined };
      expect(actual).toEqual(expected);
    });
    // cloneableGenerator only shaves off one step for this example, which is no big deal
    // but it should be clear that it could save many lines *per test* in more complex sagas
  });
});
