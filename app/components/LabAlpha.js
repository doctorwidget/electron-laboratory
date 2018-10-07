import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './LabAlpha.css';
import routes from '../constants/routes.json';

export default class LabAlpha extends Component {
  // nb: static properties are still a proposal, not part of ES2015
  static propTypes = {
    alpha: PropTypes.shape({
      active: PropTypes.bool
    }),
    alphaActivate: PropTypes.func,
    alphaDeactivate: PropTypes.func
  };

  static defaultProps = {
    alpha: {
      active: false
    },
    alphaActivate: () => {
      console.log('alphaActivate');
    },
    alphaDeactivate: () => {
      console.log('alphaDeactivate');
    }
  };

  render() {
    const { alpha, alphaActivate, alphaDeactivate } = this.props;

    return (
      <div className={styles.labAlphaOuter} data-tid="lab-alpha-outer">
        <div className={styles.backButton} data-tid="backButton">
          {/* [data-tid] should be read as 'data-test-id'... it's a hook for test assertions */}
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={styles.labAlphaInner} data-tid="lab-alpha-inner">
          <div className={styles.dashboardOuter} data-tid="dashboard-outer">
            <div className={styles.dashboardInner} data-tid="dashboard-inner">
              <div data-tid="activateStatus">
                Activation Status:
                <span id="activateStatus" aria-label="activation status">
                  {alpha.active ? 'Activated' : 'Deactivated'}
                </span>
              </div>
              <div data-tid="placeholder">
                Placeholder for more status reports
              </div>
            </div>{' '}
            {/** end dashboard-inner */}
          </div>{' '}
          {/* end dashboard-outer */}
          <div className={styles.btnGroupOuter} data-tid="btn-group-outer">
            <div className={styles.btnGroupInner} data-tid="btn-group-inner">
              <button
                className={styles.btn}
                onClick={alphaActivate}
                data-tid="activateButton"
                aria-label="Activate"
                type="button"
              >
                <i className="fa fa-toggle-on fa-5x" />
              </button>
              <button
                className={styles.btn}
                onClick={alphaDeactivate}
                aria-label="deactivate"
                data-tid="deactivateButton"
                type="button"
              >
                <i className="fa fa-toggle-off fa-5x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ); // end of return
  } // end render() method
} // end class LabAlpha
