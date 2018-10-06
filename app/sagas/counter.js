/**
 * SAGAS for the counter.
 */
import { delay } from 'redux-saga';
import { all, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

// ../actions/counter has no default action, so we must manually group it
// that's the only good reason to use 'import *': to group a mess of individual
// imports into one object rather than spraying them all into the current environment
import * as counterActions from '../actions/counter';

/**
 * Sagas tend to travel in pairs. This is a fundamental detail of the pattern!
 * Think in terms of two kinds of sagas:
 *
 * - _worker_ sagas,  which _do_ things (make async calls, navigate within the app, etc)
 * - _watcher_ sagas, which subscribe to the redux store via middleware
 *
 * The _watchers_ instantiate _workers_ in response to actions.
 */

/**
 * This __worker__ saga listens to the same INCREMENT_COUNTER action already
 * handled via thunks. At first, it will output a console message for us to
 * look at in the console. Eventually, we'll have the saga system take over
 * from the thunk system.
 */
export const doIncrement = function* doIncrement() {
  yield delay(1, 1); // just to show we can do this without affecting anything
  // the second argument *optional*; it is what the delay promise resolves to
  // What could be more appropriate for testing than resolving to the delay itself?
  console.log(`doIncrement WORKER saga logging an increment. Done.`);
  // That's a silly thing to waste code doing (for several reasons)
  // But I do want to show that sagas can listen to ALL actions
  // In other words, sagas seamlessly tap into the redux dispatcher,
  // That means sagas can be used for _all_ side effects, not just asynchronicity!
};

/**
 * The _watcher_ saga for increment events.
 * Note that this isn't actually an asynchronous operation, so there is no point
 * in handling it via a saga! I'm only throwing in this in here as a demonstration
 * that any number of listeners can be reacting to one action.
 */
export const watchIncrement = function* watchIncrement() {
  // IFF this saga is connected to the redux store via react-saga middleware
  // THENN this saga listens for INCREMENT_COUNTER actions
  // and instantiates a trialStartSaga instance in response
  yield takeEvery(counterActions.INCREMENT_COUNTER, doIncrement);
};

/** Another __worker__ saga */
export const doDecrement = function* doDecrement() {
  console.log(`doDecrement WORKER saga logging a decrement. Done.`);
  yield delay(1, 1); // again, a useless but harmless delay that resolves to itself
};

/**
 * The _watcher_ saga for decrement events.
 * Again, we just listen in on a pre-existing event type.
 */
export const watchDecrement = function* watchDecrement() {
  // IFF this saga is connected to the redux store via react-saga middleware
  // THENN this saga listens for INCREMENT_COUNTER actions
  // and instantiates a trialStartSaga instance in response
  yield takeEvery(counterActions.DECREMENT_COUNTER, doDecrement);
};

/**
 * Note that the boilerplate components don't have dedicated event types for
 * the special events: incrementIfOdd or incrementAsync. Both of those are
 * handled via the thunk system without creating a new event type. The logic
 * for this is inlined into the `{project}/actions/counter.js` file, which
 * seems like an antipattern to me, because it's clearly adding responsibility
 * to the action creator file beyond its original purpose.
 */

/**
 * Here we inmplement incrementIfEven as a saga. That means we create an action
 * type INCREMENT_IF_EVEN, which no _reducer_ will react to. This _saga_ is
 * the only thing currently set up to will react to that event. If it decides
 * the time is right, it will emit its own _INCREMENT_ action via `put(increment())`.
 * Now the business logic of odd/even lives in the saga, rather than the action
 * creator.
 *
 * But note that I think this pattern is problematic, and still needs some
 * fundamental thinking over, because I don't want to drift too far away from
 * the pattern where the REDUCERS have 100% of the business logic.
 *
 * Also note that this relies on using the select() Effect from redux-saga,
 * which exists explicitly for the purpose of peeking in to the current app
 * state. The official docs include warning along the lines of what I say
 * above: use this power responsibly!
 * https://redux-saga.js.org/docs/api/index.html#selectselector-args
 */
export const doIncrementIfEven = function* doDecrementIfEven() {
  // The {select} effect is the anointed way for redux-saga to peek at the current state
  // We could pass in an actual `reselect` selector function as the first argument.
  // By providing no arguments at all, we get the full current state back.
  const currentState = yield select(); // nb: the {yield} is required here!
  if (currentState.counter % 2 === 0) {
    console.log(
      'doIncrementIfEven WORKER saga: counter is even. Incrementing!'
    );
    yield put(counterActions.increment()); // nb: we put an instantiated action object, not an action creator function
  } else {
    console.log(
      'doIncrementIfEven WORKER saga: counter is not even. Doing nothing!'
    );
  }
};

export const watchIncrementIfEven = function* watchIncrementIfEven() {
  yield takeEvery(counterActions.INCREMENT_IF_EVEN, doIncrementIfEven);
};

/*
 * Similarly, implement a decrementAsync saga, triggered by a new action type
 * named DECREMENT_ASYNC. Again, a saga in this file will hear that
 * request, cause the delay, and then emit the same decrement() action that
 * already exists, via `put(decrement())`. Again, business logic moves from
 * the action creators file to the sagas file.
 * 
 * I like this name better than the boilerplate example of "incrementAsync".
 * Here we emphasize that a _request_ has gone out, and _someone_ or _something_
 * has to decide whether or not to approve of it. That's an utterly classic
 * side effect concern. It might get resolved purely locally, without any kind
 * of heavyweight async operation like a network call. But it's still worth
 * pulling out as a side effect, rather than having it hard-coded into one
 * reducer somewhere. Keep the reducers focused on their own pure state logic,
 * and let messy real-world concerns live as side effects in sagas.
 */
export const doDecrementAsync = function* doDecrementAsync() {
  // in this case we'll just wait a second and then approve the request
  console.log('doDecrementAsync worker saga: considering the request');
  yield delay(2000);
  console.log('doDecrementAsync worker saga: Your request has been approved!');
  yield put(counterActions.decrement());
};

/**
 * Then as a final demonstration twist, we'll use {takeLatest} instead
 * of {takeEvery}, effectively _debouncing_ this action. If the user spams
 * the decrementAsync button over and over, nothing will happen until
 * _after_ they cease their incessant clicking. Then and only then, the
 * last known decrementRequest action will be allowed to run to completion.
 * Don't reward rapid clickers!
 */
export const watchDecrementAsync = function* watchDecrementAsync() {
  yield takeLatest(counterActions.DECREMENT_ASYNC, doDecrementAsync);
};

/*
 * WORKER saga for asynchronous increment requests.
 * Implements the _asynchronous_ part, but doesn't do anything about _debouncing_
 * That is handled in the watcher saga (below). But some other watcher could
 * conceivably re-use just this part of the logic. 
 */
export const doIncrementAsync = function* doIncrementsync() {
  console.log('doIncrementAsync worker saga: considering the request');
  yield delay(2000);
  console.log('doIncrementAsync worker saga: Your request has been approved!');
  yield put(counterActions.increment());
};

/**
 * WATCHER saga for asynchronous increment requests.
 * The _watcher_ implements the debouncing via {takeLatest}
 */
export const watchIncrementAsync = function* watchIncrementAsync() {
  yield takeLatest(counterActions.INCREMENT_ASYNC, doIncrementAsync);
};

/**
 * WORKER saga for handling incrementIfOdd via sagas instead of thunks.
 * With thunks, the logic lives _inside_ the thunk, which means it lives _inside_
 * the action creator which creates the thunk.
 * With sagas, the logic lives _inside_ the saga, which means it lives _inside_
 * the worker saga (not the watcher saga). That keeps action creators simple,
 * and lets us test the worker saga in isolation.
 */
export const doIncrementIfOdd = function* doDecrementIfOdd() {
  // NB: you could pass a selector function to select() to get a slice of the overall state
  const currentState = yield select(); // remember: the {yield} is __required__
  if (currentState.counter % 2 === Math.abs(1)) {
    console.log('doIncrementIfOdd WORKER saga: counter is odd. Incrementing!');
    yield put(counterActions.increment()); // *call* the action creator function
  } else {
    console.log(
      'doIncrementIfOdd WORKER saga: counter is not odd. Doing nothing!'
    );
  }
};

export const watchIncrementIfOdd = function* watchIncrementIfOdd() {
  yield takeEvery(counterActions.INCREMENT_IF_ODD, doIncrementIfOdd);
};

/**
 * Bundle up _all_ trial-related sagas into one.
 * It's never enough to declare a worker-watcher dyad above!
 * You must always also include the watcher in the final exported saga!
 */
const allCounterSagas = function* allCounterSagas() {
  // the {all} helper takes an array of saga _instances_. Not an array of saga functions!
  // It will run them all in parallel. If any of them are infinite, this saga will also
  // be infinite. This saga will only terminate if/when _all_ of the sagas have terminated.
  yield all([
    watchIncrement(), // nb: array is full of actual generator instances, not saga functions
    watchDecrement(),
    watchIncrementIfEven(),
    watchIncrementIfOdd(),
    // could add watchDecrementIfEven if you felt obsessive-compulsive
    // could add watchDecrementIfOdd if you felt obsessive-compulsive
    watchIncrementAsync(), // deferred and debounced
    watchDecrementAsync() // deferred and debounced
    // add more sagas here as necessary
  ]);

  // The {all} effect is a convenience wrapper added after early versions of react-saga.
  // Before that, you would yield a simple array of sagas, each wrapped in a {fork}, e.g.:
  //
  //     yield [
  //          fork(watchDecrementIfOdd),  // nb: the saga function, not a generator instance
  //          fork(watchDecrementIfEven)
  //     ]
  //
  // Notice there we pass in the saga _functions_, not saga instances.
  // So think of {all} as relatively late syntactic sugar for this {fork} pattern
};
export default allCounterSagas; // and make it the default export

// nb: the _user_ of this file doesn't have to use the exact phrase 'allCounterSaga'
// see ./index.js, where we just refer to this as "counterSaga"
// (which is a better name, but I wanted to demonstrate this naming flexibility)
