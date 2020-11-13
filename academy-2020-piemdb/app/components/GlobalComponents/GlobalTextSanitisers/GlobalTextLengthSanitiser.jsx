import React from 'react';
import PropTypes from 'prop-types';

const GlobalTextLengthSanitiser = ({
  textLength, maxTextLength, message, blockFormSetter,
}) => {
  const displayedMessage = textLength >= maxTextLength ? message : '';
  const displayedMessageBool = textLength >= maxTextLength;

  // block the form if one exists
  if (displayedMessageBool) {
    blockFormSetter(true);
  } else {
    blockFormSetter(false);
  }

  return <div style={{ color: 'red', 'font-family': 'Catamaran' }} >{displayedMessage}</div>;
};

export default GlobalTextLengthSanitiser;

GlobalTextLengthSanitiser.propTypes = {
  textLength: PropTypes.number.isRequired,
  maxTextLength: PropTypes.number.isRequired,
  message: PropTypes.string,
  blockFormSetter: PropTypes.func,
};

GlobalTextLengthSanitiser.defaultProps = {
  message: 'This text is too long',
  blockFormSetter: () => { },
};
