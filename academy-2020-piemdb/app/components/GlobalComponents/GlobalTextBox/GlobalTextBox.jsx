import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const GlobalTextBox = ({
  inputProps,
  id,
  label,
  rows,
  value,
  onChange,
  onReturnPressed,
}) => {
  const keyPress = (event) => {
    if (onReturnPressed && event.keyCode === 13) {
      onReturnPressed();
    }
  };
  return (
    <TextField
      inputProps={inputProps}
      id={id}
      label={label}
      multiline
      rows={rows}
      value={value}
      fullWidth
      variant={'outlined'}
      onChange={onChange}
      onKeyDown={keyPress}
    />
  );
};

GlobalTextBox.propTypes = {
  inputProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  rows: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onReturnPressed: PropTypes.func,
};

GlobalTextBox.defaultProps = {
  inputProps: {},
  rows: 1,
  onChange: () => { },
  onReturnPressed: null,
};

export default GlobalTextBox;
