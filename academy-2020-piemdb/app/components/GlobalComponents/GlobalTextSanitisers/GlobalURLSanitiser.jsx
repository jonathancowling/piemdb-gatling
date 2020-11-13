import React from 'react';
import PropTypes from 'prop-types';
import validUrl from 'valid-url';

const GlobalURLSanitiser = ({ url, message, blockFormSetter }) => {
  const displayedMessage = validUrl.isUri(url) ? '' : message;
  const displayedMessageBool = !validUrl.isUri(url);

  // block the form if one exists
  if (displayedMessageBool) {
    blockFormSetter(true);
  } else {
    blockFormSetter(false);
  }

  return <div style={{ color: 'red', 'font-family': 'Catamaran' }} >{displayedMessage}</div>;
};

export default GlobalURLSanitiser;

GlobalURLSanitiser.propTypes = {
  url: PropTypes.string.isRequired,
  message: PropTypes.string,
  blockFormSetter: PropTypes.func,
};

GlobalURLSanitiser.defaultProps = {
  message: 'This url is invalid',
  blockFormSetter: () => {},
};
