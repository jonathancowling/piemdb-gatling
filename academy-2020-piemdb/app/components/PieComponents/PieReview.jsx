import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import {
  ReviewWrapper,
  ReviewContent,
  ReviwerName,
  ReviewHeader,
} from './ComponentStyles.jsx';

const PieReview = ({ review, reviewer, rating }) => ((review && reviewer && rating)
  ? <ReviewWrapper>
    <ReviewHeader>
      <ReviwerName>{reviewer}</ReviwerName>
      <Rating name="read-only" precision={0.5} value={rating} readOnly />
    </ReviewHeader>
    <div><ReviewContent>{review}</ReviewContent></div>
    <br />
  </ReviewWrapper> : null);

export default PieReview;

PieReview.propTypes = {
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  reviewer: PropTypes.string.isRequired,
};
