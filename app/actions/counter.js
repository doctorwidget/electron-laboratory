// @flow
/**
 * Switching to redux-saga has the happy benefit of eliminating this weird
 * dependency on things like {type, Dispatch, GetState} from the flow library
 * import type { GetState, Dispatch } from '../reducers/types';
 */

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export const INCREMENT_IF_EVEN = 'INCREMENT_IF_EVEN';
export const INCREMENT_IF_ODD = 'INCREMENT_IF_ODD';

export const INCREMENT_ASYNC = 'INCREMENT_ASYNC';
export const DECREMENT_ASYNC = 'DECREMENT_ASYNC';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

/** Original thunk version of incrementIfOdd
 * How would you test this in Jest?
 * This function returns another function.
 * That function needs both dispatch and getState() to do anything!
 * When even, _nothing happens_
 * When odd, another action gets generated.
 * The whole thing is a poor candidate for unit testing.
export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
*/

/** Original thunk version of incrementAsync -- now not used at all 
 * Hard to test: see {project}/test/actions/counter.js for the commented-out test code
export function incrementAsync(delay: number = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
*/

/**
 * Redux-saga-centric actions follow -- not part of the original boilerplate.
 * In this pattern, the logic stays _out_ of the action creators, and moves
 * to the sagas.js files. Contrast that with incrementIfOdd && incrementAsync
 * above, which are thunk-centric, putting logic into the action creators file.
 *
 * Every Action type must have an associated action creator if we want it to
 * participate in the bindActionCreators shortcut. However, I am still on the
 * fence about whether or not that shortcut is worth the loss of clarity it
 * brings along with it.
 */

/**
 * This action type is intended to be heard by redux-saga
 */
export function incrementIfEven() {
  return {
    type: INCREMENT_IF_EVEN
  };
}

/**
 * Redux-saga replacement for original thunk incrementIfOdd
 *
 * _Requests_ that we increment... maybe!
 * Logic is not handled within the action creator: this is a big advantage
 * redux-saga has over redux-thunk, IMHO. Action creators stay puny, and
 * logic is going to live in sagas, which are always testable due to
 * returning highly-predictable Effect objects.
 */
export function incrementIfOdd() {
  return {
    type: INCREMENT_IF_ODD
  };
}

/**
 * This action type is intended to be heard by redux-saga
 */
export function decrementAsync() {
  return {
    type: DECREMENT_ASYNC
  };
}

/**
 * Request for a delayed and debounced increment.
 */
export function incrementAsync() {
  return {
    type: INCREMENT_ASYNC
  };
}
