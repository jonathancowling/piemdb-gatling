import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  Subtitle,
} from './ComponentStyles.jsx';

const Heading = ({ type, content }) => {
  if (type.localeCompare('main') === 0) {
    return (content ? <Title>{content}</Title> : null);
  // eslint-disable-next-line no-else-return
  } else if (type === 'sub') {
    return (content ? <Subtitle>{content}</Subtitle> : null);
  }
  return null;
};

export default Heading;

Heading.propTypes = {
  type: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
