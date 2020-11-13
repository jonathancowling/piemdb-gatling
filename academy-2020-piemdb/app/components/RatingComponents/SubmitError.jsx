import React from 'react';
import PropTypes from 'prop-types';

const SubmitError = ({ show }) => {
  if (show) {
    return (<div style={{ 'font-family': 'Catamaran', color: 'red', 'text-align': 'center' }}>Your review has failed to submit</div>);
  }
  return (<div></div>);
};

export default SubmitError;

SubmitError.propTypes = {
  show: PropTypes.bool.isRequired,
};
