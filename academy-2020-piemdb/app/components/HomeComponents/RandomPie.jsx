import React from 'react';
import { Link } from 'react-router-dom';
import GlobalButton from '../GlobalComponents/GlobalButton/GlobalButton.jsx';
import randomPie from '../../hooks/useRandPie';

const RandomPie = () => {
  const id = randomPie();
  // call in the random pie and store here
  /*
    button click returns pi id
    which we send to pipage/id
  */
  return (<Link to={`/pie-page/${id}`} style={{ textDecoration: 'none' }}>
      <GlobalButton colour='primary' contents='Go to a random pie'/>
  </ Link>);
};

export default RandomPie;
