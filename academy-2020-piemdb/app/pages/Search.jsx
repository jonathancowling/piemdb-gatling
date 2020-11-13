import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../components/HomeComponents/SearchBar.jsx';
import SearchResult from '../components/SearchComponents/SearchResult.jsx';
import makeSearch from '../api/makeSearch';

const Container = styled.div`
max-width: 1200px;
margin: 0px auto;
`;

const Search = () => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  useEffect(() => {
    const search = async () => {
      if (query) {
        const searchResults = await makeSearch(query);
        setResults(searchResults);
      }
    };
    search();
  }, [query]);
  return (
    <Container>
      <SearchBar passedQuery={query}/>
      {results.map((r) => (
        <SearchResult key={r} pieId={r}/>
      ))}
    </Container>
  );
};

export default Search;
