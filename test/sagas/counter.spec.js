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

import * as sagas from '../../app/sagas/counter';

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
});
