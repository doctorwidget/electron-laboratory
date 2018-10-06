/**
 * Original tests had to deal with thunks, and used sinon for this
 * I think we have now removed all need for sinon... 
 * (and doesn't Jest handle that out of the box anyway?)
  import { spy } from 'sinon';
 */
import * as actions from '../../app/actions/counter';

describe('actions', () => {
  it('should increment should create increment action', () => {
    // nb: the boilerplate uses toMatchSnapshot on the return object from increment()
    // it turns out this works! jest.toMatchSnapshot can treat an object hash just like a JSX output
    // However this seems too clever by half
    // I mean, what are you really testing? That there's been no change increment() output...
    // but wouldn't it be better to say something more explicit?
    expect(actions.increment()).toMatchSnapshot();
    // something like this!
    expect(actions.increment().type).toEqual(actions.INCREMENT_COUNTER);
  });

  it('should decrement should create decrement action', () => {
    // the boilerplate clever test:
    expect(actions.decrement()).toMatchSnapshot();
    // our own less-code-golfish test:
    expect(actions.decrement().type).toEqual(actions.DECREMENT_COUNTER);
  });

  /** Thunks replaced by sagas tests 
  it('should incrementIfOdd should create increment action', () => {
    const fn = actions.incrementIfOdd();
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    const getState = () => ({ counter: 1 });
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(true);
  });
  */

  /** Thunks replaced by sagas tests
  it('should incrementIfOdd shouldnt create increment action if counter is even', () => {
    const fn = actions.incrementIfOdd();
    const dispatch = spy();
    const getState = () => ({ counter: 2 });
    fn(dispatch, getState);
    expect(dispatch.called).toBe(false);
  });
  */

  it('incrementIfOdd should always create an incrementIfOdd action', () => {
    // confirmed that I can create new tests with new action creators,
    // and Jest will fail the test if I subsequently change the string constant name of the action
    // So yes, this approach is _an option_
    // And it might even be a good option once you start decorating actions with payloads
    expect(actions.incrementIfOdd()).toMatchSnapshot();
    // But I kind of feel like the whole point of unit tests is to accept some WET code
    // in exchange for dirt-simple reassurance that your code is doing exactly what you think it is
    // In other words, not "does this output look like it did whenever I last committed snapshots"
    // but instead "does this output look exactly like what I type next"
    expect(actions.incrementIfOdd().type).toEqual(actions.INCREMENT_IF_ODD);
  });

  /** 
  * Original test for incrementAsync
  * The action test is now clean and simple, focused only on the action itself.
  * See the ../sagas/counter.spec.js file for saga logic testing
  // There's no nice way to test this at the moment...
  it('should incrementAsync', done => {
    const fn = actions.incrementAsync(1);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    setTimeout(() => {
      expect(dispatch.calledWith({ type: actions.INCREMENT_COUNTER })).toBe(
        true
      );
      done();
    }, 5);
  });
  */

  it('incrementAsync should always create an incrementAsync action', () => {
    expect(actions.incrementAsync().type).toEqual(actions.INCREMENT_ASYNC);
  });
});
