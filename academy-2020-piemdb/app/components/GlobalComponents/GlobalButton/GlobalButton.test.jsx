import React from 'react';
import each from 'jest-each';
import { render, screen, cleanup } from '@testing-library/react';
import GlobalButton from './GlobalButton.jsx';

afterEach(cleanup);

describe('/components/GlobalComponents/GlobalButton.jsx', () => {
  each([
    [
      'primary',
      'primary button',
      'rgb(63, 81, 181)',
    ],
    [
      'secondary',
      'secondary button',
      'rgb(245, 0, 87)',
    ],
    [
      'default',
      'default button',
      'rgba(0, 0, 0, 0.87)',
    ],
    [
      'not a colour',
      'not a colour button',
      'rgb(63, 81, 181)',
    ],
  ]).it('Should be the correct formatting as per the props', (colour, text, colourCode) => {
    render(<GlobalButton contents={text} colour={colour} />);
    const Button = screen.getByTestId('global-button');
    expect(Button).toHaveTextContent(`${text}`);
    expect(Button).toHaveStyle(`color: ${colourCode}`);
  });
});
