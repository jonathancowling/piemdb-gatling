import React from 'react';
import {
  Link,
} from 'react-router-dom';
import GlobalButton from '../../GlobalComponents/GlobalButton/GlobalButton.jsx';

// Inconsistent spacing in JSX (extra line break, tabs)
const SubmitPie = () => (
    <Link to = '/submitForm' style={{ textDecoration: 'none' }}>
      <GlobalButton contents='Submit a pie' />
    </Link>
);

export default SubmitPie;
