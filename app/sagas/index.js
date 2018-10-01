/**
 * BARREL file for all saga-related code.
 */
import { all } from 'redux-saga/effects';

// all sagas related to the counter should be composed and exported as one overall saga
import counterSaga from './counter';

// could add additional composed saga function here
// import fooSaga from './foo.js';
// import barSaga from './bar.js';

// then compose all of the sub-sagas into one final rootSaga
const rootSaga = function* rootSaga() {
  // run all sub-sagas in parallel
  yield all([
    counterSaga()
    // fooSaga(),
    // barSaga()
  ]);
};
export default rootSaga; // and export it
