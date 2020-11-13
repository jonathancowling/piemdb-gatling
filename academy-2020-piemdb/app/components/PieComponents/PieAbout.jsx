import React from 'react';
import styled from 'styled-components';

import PropTypes from 'prop-types';
import {
  Content,
  ContentTitle,
} from './ComponentStyles.jsx';

const Inline = styled.div`
  display:flex;
  flex-direction: row;
  text-align: left;
margin-left:2rem;
width: 100%;
`;

const Stacked = styled.div`
display:flex;
flex-direction: column;
line-spacing: 0rem;
margin-left:2rem;
width: 100%;
`;

const PieWrapper = styled.div`
display:flex;
flex-direction: column;
text-align: left;
line-spacing: 0rem;
width: 100%;
`;

export const PieAboutTop = ({ pie }) => (
  <PieWrapper>
    <Inline><ContentTitle>From: </ContentTitle>
      <Content>{pie.location}, {pie.establishment}</Content></Inline>
    <Inline><ContentTitle>Cost: </ContentTitle>
      <Content>{pie.cost}</Content></Inline>
    <Stacked><ContentTitle>Description: </ContentTitle>
      <Content>{pie.description}</Content></Stacked>
    {/* <Wrapper><Title>Establishment: </Title><Content>{Pie.establishment}</Content></Wrapper> */}
  </PieWrapper>
);

export const PieAboutBottom = ({ pie }) => (
  <PieWrapper>
    <Inline><ContentTitle>Date Posted: </ContentTitle>
        <Content>{pie['date-posted']}</Content></Inline>
      <Inline><ContentTitle>Recipe Link: </ContentTitle>
        <Content>{pie['recipe-link']}</Content></Inline>
  </PieWrapper>
);

module.exports = {
  PieAboutTop,
  PieAboutBottom,
};

PieAboutTop.propTypes = {
  // description: PropTypes.string.isRequired,
  pie: PropTypes.shape({
    description: PropTypes.string.isRequired,
    establishment: PropTypes.string,
    location: PropTypes.string,
    cost: PropTypes.string,
  }),
};
PieAboutBottom.propTypes = {
  // description: PropTypes.string.isRequired,
  pie: PropTypes.shape({
    'date-posted': PropTypes.string.isRequired,
    'recipe-link': PropTypes.string,
  }),
};
