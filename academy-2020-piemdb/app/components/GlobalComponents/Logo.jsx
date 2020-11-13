import React from 'react';
import PropTypes from 'prop-types';
import image from '../../images/PieMDB-logo-colour.png';

const Logo = ({ width, height }) => <img src={image}
  alt='The PieMDB logo, which is a drawing of pie!'
  width={width} height={height} />;

export default Logo;

Logo.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};
