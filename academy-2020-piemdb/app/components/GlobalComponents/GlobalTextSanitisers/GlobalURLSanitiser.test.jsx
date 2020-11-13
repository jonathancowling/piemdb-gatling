import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import each from 'jest-each';
import GlobalURLSanitiser from './GlobalURLSanitiser.jsx';

afterEach(cleanup);

describe('/components/GlobalTextSanitisers/GlobalTextLengthSanitiser.jsx', () => {
  each([
    [
      'piemdb.infinipie.works/',
    ],
    [
      'http://piemdb. infinipie.works/',
    ],
    [
      'I\'m Slim Shady yes I\'m the real Shady',
    ],
  ]).it('should display for an invalid url', (url) => {
    render(<GlobalURLSanitiser url={url} message='test message' />);

    const element = screen.queryByText('test message');
    expect(element).toBeTruthy();
    expect(element.style.color).toBe('red');
  });

  it('should not display for a valid url', () => {
    render(<GlobalURLSanitiser url='http://piemdb.infinipie.works/' message='test message' />);
    const element = screen.queryByText('test message');
    expect(element).toBeFalsy();
  });

  it('should call the blockFormSetter function with false for a valid url', () => {
    const blockFunction = jest.fn();

    render(<GlobalURLSanitiser url='http://piemdb.infinipie.works/' message='test message' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(false);
  });

  it('should call the blockFormSetter function with true for an invalid url', () => {
    const blockFunction = jest.fn();

    render(<GlobalURLSanitiser url={'I\'m Slim Shady yes I\'m the real Shady'} message='test message' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(true);
  });
});
