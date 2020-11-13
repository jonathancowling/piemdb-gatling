import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GlobalButton from '../GlobalComponents/GlobalButton/GlobalButton.jsx';
import GlobalTextBox from '../GlobalComponents/GlobalTextBox/GlobalTextBox.jsx';

const SearchBar = ({ passedQuery, history }) => {
  const [query, setQuery] = useState(passedQuery);
  const onChange = (event) => {
    setQuery(event.target.value.replace('\n', ''));
  };
  const submit = () => {
    history.push(`/search/${query}`);
  };
  return (
    <SurroundingDiv>
      <GlobalTextBox id='SearchBar' label='Search for a pie' value={query} onChange={onChange} onReturnPressed={submit} />
      <Link to={`/search/${query}`} style={{ textDecoration: 'none' }}>
        <GlobalButton colour='primary' contents='Go' />
      </Link>
    </SurroundingDiv>
  );
};

const SurroundingDiv = styled.div`
display: flex;
flex-direction: row;
`;

SearchBar.propTypes = {
  passedQuery: PropTypes.string,
  history: PropTypes.object,
};

SearchBar.defaultProps = {
  passedQuery: '',
};

export default withRouter(SearchBar);
