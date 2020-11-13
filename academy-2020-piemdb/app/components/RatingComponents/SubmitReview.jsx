import React, { useState } from 'react';
import Reaptcha from 'reaptcha';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import GlobalButton from '../GlobalComponents/GlobalButton/GlobalButton.jsx';
import { submitReviewAPI } from '../../api/submitReviewAPI';
import GlobalTextBox from '../GlobalComponents/GlobalTextBox/GlobalTextBox.jsx';
import GlobalTextLengthSanitiser from '../GlobalComponents/GlobalTextSanitisers/GlobalTextLengthSanitiser.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50ch',
    },
  },
}));

export default function SubmitReview({
  setReviews, reviews, setShowForm, setShowError,
}) {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [recaptureBlockBool, setRecaptureBlockBool] = React.useState(true);
  const [recaptureToken, setRecaptureToken] = React.useState('');

  const handleRecaptureVerification = (event) => {
    setRecaptureBlockBool(false);
    setRecaptureToken(event);
  };
  const [nameLength, setNameLength] = React.useState(0);
  const [reviewLength, setReviewLength] = React.useState(0);

  const reviewWarning = 'Wooah, calm down. It can\'t have been that bad?! Please keep your review to 500 characters.';

  const [nameBlocker, setNameBlocker] = useState(false);
  const [reviewBlocker, setReviewBlocker] = useState(false);

  const blockButton = nameBlocker || reviewBlocker || recaptureBlockBool;

  const handleChangeName = (event) => {
    setName(event.target.value);
    setNameLength(event.target.value.length);
  };

  const handleChangeReview = (event) => {
    setReview(event.target.value);
    setReviewLength(event.target.value.length);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ourData = {
      name,
      'review-text': review,
      rating,
      'sort-key': 'REVIEW',
    };
    const url = (window.location.href);
    const urlSplit = url.split('/');
    const piePageID = urlSplit[urlSplit.length - 1];
    // added this disable so errors can be logged
    // eslint-disable-next-line no-console
    submitReviewAPI(piePageID, ourData, recaptureToken).then((res) => {
      if (res.status === 400) {
        setShowError(true);
      }
    }).catch((error) => console.log(error));
    setReviews([ourData, ...reviews]);
    setShowForm(false);
  };

  return (
    <>
      <form data-testid="submit-review-form" className={classes.root} noValidate autoComplete="off">
        <div data-testid="rating-input-div" inputprops={{ 'data-testid': 'rating-input' }}>
          <Box component="fieldset" mb={3} borderColor="transparent" >
            <Typography component="legend">Your pie rating</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
        </div>
        <GlobalTextBox
          inputProps={{ 'data-testid': 'name-input' }}
          id="outlined-multiline-static"
          label="Enter your name"
          multiline
          rows={1}
          fullWidth
          variant="outlined"
          onChange={handleChangeName}
        />
        <GlobalTextLengthSanitiser textLength={nameLength} maxTextLength={25} message='This name is too long' blockFormSetter={setNameBlocker} />
        <div>
          <GlobalTextBox
            inputProps={{ 'data-testid': 'text-input' }}
            id="outlined-multiline-static"
            label="Insert your review!"
            multiline
            rows={4}
            defaultValue=""
            fullWidth
            variant="outlined"
            onChange={handleChangeReview}
          />
        </div>
        <GlobalTextLengthSanitiser textLength={reviewLength} maxTextLength={500}
          message={reviewWarning} blockFormSetter={setReviewBlocker} />
        <GlobalButton colour='primary' contents='Submit Review' whenClicked={handleSubmit} disabled={blockButton} />
        <Reaptcha sitekey="6LceYt8ZAAAAAMFnw_5fsTYOjNXe1H3pMe_hAJ14" onVerify={handleRecaptureVerification} />
      </form>
    </>
  );
}

SubmitReview.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  setReviews: PropTypes.func.isRequired,
  reviews: PropTypes.array.isRequired,
  setShowError: PropTypes.func.isRequired,
};
