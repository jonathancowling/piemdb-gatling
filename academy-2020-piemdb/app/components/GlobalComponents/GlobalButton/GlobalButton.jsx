import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import useStyles from './GlobalButtonStyles.jsx';

export default function GlobalButton({
  colour, contents, whenClicked, disabled,
}) {
  const classes = useStyles();
  let buttonColour = 'primary';
  // Compute colour and then you only need one JSX block
  if (colour === 'primary' || colour === 'secondary' || colour === 'default') {
    buttonColour = colour;
  }

  return (
    <div className={classes.root}>
      <Button data-testid='global-button' variant='outlined' color={buttonColour} onClick={whenClicked} disabled={disabled}>{contents}</Button>
    </div>
  );
}

GlobalButton.propTypes = {
  colour: PropTypes.string,
  contents: PropTypes.string.isRequired,
  whenClicked: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GlobalButton.defaultProps = {
  whenClicked: () => { },
  disabled: false,
};
