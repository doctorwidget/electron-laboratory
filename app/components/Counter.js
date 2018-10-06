// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Counter.css';
import routes from '../constants/routes.json';

type Props = {
  increment: () => void,
  incrementIfEven: () => void,
  incrementIfOdd: () => void,
  incrementAsync: () => void,
  decrementAsync: () => void,
  decrement: () => void,
  counter: number
};

export default class Counter extends Component<Props> {
  props: Props;

  render() {
    const {
      increment,
      incrementIfEven,
      incrementIfOdd,
      incrementAsync,
      decrementAsync,
      decrement,
      counter
    } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={increment}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-plus" />
          </button>
          <button
            className={styles.btn}
            onClick={decrement}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-minus" />
          </button>
          <button
            className={styles.btn}
            onClick={incrementIfOdd}
            data-tclass="btn"
            type="button"
          >
            odd
          </button>
          <button
            className={styles.btn}
            onClick={incrementIfEven}
            data-tclass="btn"
            type="button"
            title="Now with more redux-saga"
          >
            even
          </button>
          <button
            className={styles.btn}
            onClick={decrementAsync}
            data-tclass="btn"
            type="button"
            title="A debounced and deferred decrement"
          >
            ...Dec
          </button>
          <button
            className={styles.btn}
            onClick={incrementAsync}
            data-tclass="btn"
            type="button"
            title="A debounced and deferred increment"
          >
            ...Inc
          </button>
        </div>
      </div>
    );
  }
}
