import React from 'react';
import PropTypes from 'prop-types';

const PieRating = ({ rating }) => (rating ? <div>This pie has a rating of: {rating}</div> : null);

export default PieRating;

PieRating.propTypes = {
  rating: PropTypes.number.isRequired,
};
