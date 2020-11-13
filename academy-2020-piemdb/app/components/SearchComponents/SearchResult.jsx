import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import getPie from '../../api/getPie';

const Container = styled.div`
max-width: 1200px;
margin: 32px auto;
background-color: #f3f8ff;
color: #003589;
font-family: Merriweather;
font-size: 36px;
font-weight: 700;
line-height: 45px;
letter-spacing: 0em;
text-align: left;
padding: 16px;
display: flex;
flex-direction: row;
flex-wrap: wrap;
`;

const Image = styled.img`
max-width: 300px;
`;

const Column = styled.div`
margin-left: 16px;
margin-right: 16px;
min-width: 300px;
`;

const Description = styled.p`
font-size: 20px;
line-height: 25px;
font-weight: 300;
`;

const SearchResult = ({ pieId }) => {
  const [pie, setPie] = useState(null);
  useEffect(() => {
    const fetchPie = async () => {
      const fetchedPie = await getPie(pieId);
      setPie(fetchedPie);
    };
    fetchPie();
  }, [pieId]);
  return pie ? (
    <Link to={`/pie-page/${pieId}`} style={{ textDecoration: 'none' }}>
      <Container>
        <Column>
          <Image src={pie.image}/>
        </Column>
        <Column style={{ width: '300px' }}>
          <p>{pie.name}</p>
          <Description>{pie.location}</Description>
        </Column>
        <Column>
          <Description>{pie.description}</Description>
        </Column>
      </Container>
    </Link>
  ) : null;
};

export default SearchResult;

SearchResult.propTypes = {
  pieId: PropTypes.string.isRequired,
};
