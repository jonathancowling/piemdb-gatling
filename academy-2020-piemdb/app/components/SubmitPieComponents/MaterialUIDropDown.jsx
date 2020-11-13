import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DropDown({ onChanged, blockFormSetter }) {
  const classes = useStyles();
  const [location, setLocation] = React.useState('');

  const handleChange = (event) => {
    setLocation(event.target.value);
    onChanged(event.target.value);
    blockFormSetter(false);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="drop-down-label">Type</InputLabel>
        <Select
          labelId="drop-down-select-label"
          id="drop-down"
          value={location}
          onChange={handleChange}
        >
          <MenuItem value={'Restaurant'}>Restaurant</MenuItem>
          <MenuItem value={'Recipe'}>Recipe</MenuItem>
          <MenuItem value={'Shop'}>Shop</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

DropDown.propTypes = {
  onChanged: PropTypes.func.isRequired,
  blockFormSetter: PropTypes.func,
};

DropDown.defaultProps = {
  blockFormSetter: () => { },
};
