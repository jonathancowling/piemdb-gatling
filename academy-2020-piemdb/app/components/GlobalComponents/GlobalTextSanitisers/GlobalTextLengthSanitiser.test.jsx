import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import GlobalTextLengthSanitiser from './GlobalTextLengthSanitiser.jsx';

afterEach(cleanup);

describe('/components/GlobalTextSanitisers/GlobalTextLengthSanitiser.jsx', () => {
  it('should display for an input that is too long', () => {
    render(<GlobalTextLengthSanitiser textLength={5} maxTextLength={2} message='test message' />);

    const element = screen.queryByText('test message');
    expect(element).toBeTruthy();
    expect(element.style.color).toBe('red');
  });

  it('should not display for an input that is short', () => {
    render(<GlobalTextLengthSanitiser textLength={5} maxTextLength={10} message='test message' />);

    const element = screen.queryByText('test message');
    expect(element).toBeFalsy();
  });

  it('should call the blockFormSetter function with false for an input that is short', () => {
    const blockFunction = jest.fn();

    render(<GlobalTextLengthSanitiser textLength={5} maxTextLength={10} message='test message' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(false);
  });

  it('should call the blockFormSetter function with true for an input that is long', () => {
    const blockFunction = jest.fn();

    render(<GlobalTextLengthSanitiser textLength={5} maxTextLength={2} message='test message' blockFormSetter={blockFunction} />);

    expect(blockFunction).toHaveBeenCalledTimes(1);
    expect(blockFunction).toHaveBeenCalledWith(true);
  });
});
