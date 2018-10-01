// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export const INCREMENT_IF_EVEN = 'INCREMENT_IF_EVEN';
export const DECREMENT_REQUEST = 'DECREMENT_REQUEST';

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

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(delay: number = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}

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
 * This action type is intended to be heard by redux-saga
 */
export function decrementRequest() {
  return {
    type: DECREMENT_REQUEST
  };
}
