import React from 'react';
import styled from 'styled-components';
import Logo from '../components/GlobalComponents/Logo.jsx';
import RandomPie from '../components/HomeComponents/RandomPie.jsx';
import SearchBar from '../components/HomeComponents/SearchBar.jsx';
import SubmitPie from '../components/HomeComponents/SubmitPie/SubmitPie.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  background-color: #FFFFFF;
`;

const Home = () => (
  <Container>
    <Logo/>
    <SearchBar/>
    <RandomPie/>
    <SubmitPie/>
  </Container>
);

export default Home;
