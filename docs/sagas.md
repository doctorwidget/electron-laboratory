# Sagas

I really want to use [redux-saga](https://github.com/redux-saga/redux-saga)
instead of [redux-thunk](https://github.com/reduxjs/redux-thunk), even though
the react boilerplate is preconfigured for thunks. I think sagas are a better
fit for a couple of reasons:

1. They are **testable**, whereas thunks are fundamentally not test-friendly
2. They can be cleanly _interrupted_ if necessary.

See also this [excellent saga tutorial](https://flaviocopes.com/redux-saga/)

## Effects Make Things Testable

Sagas make things testable via their `Effects`. An effect is a term of art for
a small object that encapsulates an action... the same way that Redux itself
uses its own term of art `Action`. An `Action` is a small object encapsulating
an action that Redux reducers know how to consume. An `Effect` is a small
object encapsulating an action that `redux-saga` middleware knows how to
consume. They are the same pattern, just with different consumers.

By encapsulating the action like this, you have made it **testable**. An Effect
has two or three fields holding static values (a string name, a re-used
function, possibly a bit of data as a primitive) that are highly amenable to
unit test comparisons. Better yet, the effect object doesn't actually mutate
anything by iself, which means you are free to run all the tests you like on it
synchronously:

```javascript
test('incrementAsync Saga test', assert => {
  const gen = incrementAsync(); // make me a generator!

  assert.deepEqual(
    gen.next().value, // run generator step #1
    call(delay, 1000), // and predict we get an Effect of this shape
    'incrementAsync Saga must call delay(1000)'
  );

  assert.deepEqual(
    gen.next().value, // run generator step #2
    put({ type: 'INCREMENT' }), // and predict we get an effect of this shape
    'incrementAsync Saga must dispatch an INCREMENT action'
  );

  assert.deepEqual(
    gen.next(), // run generator step #3
    { done: true, value: undefined }, // and predict we get an effect of this shape
    'incrementAsync Saga must be done'
  );

  assert.end();
});
```

So **this** is why `redux-saga` is more testable than thunks, right out of the
box. This testability relies on you, the programmer, _using_ the tools that
`redux-saga` provides to you. As long as you make sure all of your `yield`
statements yield something wrapped in an `Effect`, you will find writing unit
tests to be utterly simple, even for complex asynchronous patterns. If you
choose not to return `Effects`, redux-saga won't stop you, but you're only
making your life harder.

This is why `redux-saga` has such a rich bestiary of `Effects`, to the point
where many of them seem superfluous:

- call - wraps a function call in an Effect synchronously: blocks the saga!
- fork - Wraps a function call in an Effect asynchronously: saga moves on!
- take - takes once, then the saga moves on
- takeEvery (infinite loop... must be the last thing in a saga)
- takeLatest (like takeEvery, but cancels old and only uses last known)
- put - synonym for ancestral Redux `dispatch`, but wrapped in an Effect
- every
- cancel - cancels uncompleted tasks (use on `fork` return objects)
- ... and so many more

In most cases, there is nothing preventing you from directly returning the
thing itself: you could return a promise directly instead of wrapping it in
`call`, or you could dispatch a Redux Action directly, instead of wrapping it
in `put`. In both cases, you would have saved a few keystrokes, but made your
code far less **testable**. _Testability_ is the reason to always use an
`Effect` wrapper, even when you could get away without one.

## Canceling Sagas

The second part is crucial for the kinds of apps I write. It's super common to have
a test stimulus pattern like so:

- show stimulus, and start a timer of duration X (the `timeout` timer)
- if the user clicks, go to the next screen and _cancel_ the timeout timer.
- if the user never clicks, go to the next screen when the timeout timer fires.

(In practice, the next screen is probably an interim screen, which will show for
a fixed duration, followed by another stimulus screen, but that's neither here
nor there)

There is no obviously thunk-centric way to implement that. If you emit the timeout
timer as a thunk, you can't _cancel_ it when the user responds. You would have to
do some kind of workaround like:

- assign each stimulus screen a uuidish identifier (`'a98xdfae3'`)
- include that identifier in the `thunk`
- make the _current_ stimulus available in the state
- when the thunk fires, check to see if the current id matches the specified id
- take no action if they don't match

That would certainly work, but it's much simpler if you use `redux-saga`,
because they have a `cancel` Effect wrapper built into the core. This lets you
include cancelation code paths as part of any saga.

The `race` Effect does exactly what we need here: given 2+ effects, the outer
yield returns as soon as any of the effects does. The other Effects are
canceled _automatically_.

```javascript
// pseudocode!
while (stimuli.hasNext()) {
    const { response, timeout } = yield race({
      response: take('USER_CLICKED'), // an action constant
      timeout: delay(6000, true) // arg#2 is optional, will be the promise result
    })
    // proceed to deal with timeout (if it happened)
    // record a timeout response, then advance stimuli by one, move on

    // proceed to deal with response (otherwise)
    // record a user response, then advance stimuli by one, move on

    yield put({type: 'INTERIM'}); // make the UI re-render with an intermediate screen
    // this happens synchronously / instantaneously, because it's not a promise

    yield delay(2000); // wait, doing nothing
    // and as soon as that's done, move to the next trial
}

yield put({type: 'TRIAL_COMPLETE'});
// REDUCER acts on this
// ... stimulusDeck changes to be {complete}
// ... stimulusDeck moves to {completedTrials} in-memory array
// ... top-level {currentTrial} gets set to null
// ... top-level {state} gets set to {Epilogue} (vs Records)
// ... app re-renders based on .state: epilogue (a navigation to an epilogue screen)
```

The form above takes and returns an _object_. The race will resolve to a single
object hash, e.g. `{response: USER_CLICKED}` or `{timeout: true}`. Since
we're destructuring that response, the two `const` values will end up with one
having a value and the other simply being `undefined`. Also note that if the
response wins the race, the value will be the actual Action object corresponding
to the string constant type -- it won't just be the string constant itself!

You also have the option to pass in an array and deconstruct the returned value
via positional destructuring.

Finally, remember that our testing logic tends to get more and more complicated
because Ian inevitably adds more and more conditions to the process -- the clinician
should be able to:

- pause the trial
- fast forward one stimulus (like a manual timeout)
- fast forward to the next series (skipping the rest of the series)
- abort the whole trial (and go to the end screen)

By the time we've handled all of those cases in imperative code, things are
inevitably tangled up and hard to reason about. But the `race` effect just
keeps scaling up horizontally, without requiring us to nest logic deeper and
deeper.

```javascript
// pseudocode!
while (stimuli.hasNext()) {
    const { response, timeout, pause, nextStimulus, nextSeries, abort } = yield race({
      response: take('USER_CLICKED'), // an action constant
      timeout: delay(6000, true) // arg#2 is optional, will be the promise result
      pause: take('PAUSE_REQUESTED'), // someone clicked a pause button or keystroke or ??
      nextStimulus: take('NEXT_STIMULUS'), // someone requested the next stim right away
      nextSeries: take('NEXT_SERIES'), // someone requested the whole next series
      abort: take('ABORT_REQUEST')
    });
    // proceed to deal with timeout (if it happened)
    // proceed to deal with response (otherwise)

    // deal with pause (start new saga? or subsaga... remember we can {yield from})
    // so define a separate paused saga that waits for either 'resume' or 'abort'
    // and nothing else. Then yield from it while staying inside this {while}

    // deal with nextStimulus: update stimuli deck with one SKIP, move on
    // deal with nextSeries: update stimuli deck with multiple SKIP, move on
    // deal with abort: update stimuli deck with all remaining ABORT, move on

    // remainder of trial logic unchanged from above
  }
// remainder of trial logic unchanged
```

The beautiful thing here is how clearly we're showing the (fairly complex!)
high-level logic of going through a fully-fleshed-out trial, but without losing
_any_ of the signal to language noise. Instead of an impenetrable mesh of
boolean checks, we have a _declarative_ record of exactly how we intend a trial
to flow.

## Actual Changes

Let's actually install `redux-saga` and use it side-by-side with the existing,
pre-installed `redux-thunk`. They aren't someone _incompatible_ with each
other; the presence of one does not break the other. Obviously, in a real
project you'd have only one or the other, but this is our workbench and
laboratory, so there's no reason we can't run both of them side-by-side.

```yml
# if this were npm, the command would be "npm install --save redux-saga"
>
  yarn add redux-saga
  # the --save is implied/automagic, and the command is "add" instead of "install"

  # I checked and confirmed that package.json __is__ updated to include redux-saga
```

### Low Level: Create A Saga

First we create a `{project}/app/sagas` directory, to hold all sagas. Don't go
into analysis paralysis about the most-optimal long-term structure for a huge
production app right now : one directory for all sagas is going to be fine for
our purposes.

Then create two files:

- {project}/app/sagas/index.js
- {project}/app/sagas/counterSaga.js

Ultimately `index.js` will be the barrel file that handles all the
gather-and-join logic for all sagas. The outside world will import only
`index.js`, and each individual saga files can focus like a laser only on their
own specific domain.

### High Level Integration

Then we import `sagaMiddleware` from `react-saga`, and use it as one of the
arguments to the redux middleware factory function. Because we're using the
`electron-boilerplate`, this is _not_ a simple process! For one thing, the
Redux store gets configured twice!:

- {project}/app/store/configureStore.dev.js
- {project}/app/store/configureStore.prod.js

And the two files are _very_ different. The clean examples you'll see in the
`redux-saga` documentation get split up and done piecemeal:

```javascript
// inside configureStore.dev.js - not done for production at the time of this writing!
// most of file elided

// in the imports area at the start of the file
import thunk from 'redux-thunk'; // pre-existing line
import { createSagaMiddleware } from 'redux-saga'; // new line
import sagas from '../sagas'; // new line

// Further down, inside the configureStore function:
// Saga middleware
const sagaMiddleware = createSagaMiddleware(); // NEW for sagas
middleware.push(sagaMiddleware);

// further down, __after__ the  call to Redux applyMiddleware().
// Calling it too early throws an error!
sagaMiddleware.run(sagas);
```

And now we should have both `thunk` and `saga` middleware running together
in peace and harmony.
