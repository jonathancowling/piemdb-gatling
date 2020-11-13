import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Img = styled.img`
height: auto;
max-width: 100%;
margin-bottom: 1rem;
`;

const PiePicture = ({ picture }) => (picture ? <Img src={picture}/> : null);

export default PiePicture;

// I'm guessing that the picture is a string to the source
PiePicture.propTypes = {
  picture: PropTypes.string.isRequired,
};
