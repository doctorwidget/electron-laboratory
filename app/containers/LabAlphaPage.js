import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LabAlpha from '../components/LabAlpha';
import * as actions from '../actions/labAlpha';

function mapStateToProps(state) {
  return {
    alpha: state.alpha
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabAlpha);
