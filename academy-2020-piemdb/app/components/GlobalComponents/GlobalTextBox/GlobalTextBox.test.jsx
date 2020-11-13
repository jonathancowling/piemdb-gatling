import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import GlobalTextBox from './GlobalTextBox.jsx';

afterEach(cleanup);

describe('/components/GlobalComponents/GlobalTextBox/GlobalTextBox.jsx', () => {
  it('should return a text box with the correct default text', () => {
    render(<GlobalTextBox
      inputProps={{ 'data-testid': 'test-box' }}
      id="test-box-id"
      label="test-label"
      value="Some text here"
    />);

    const Box = screen.getByTestId('test-box');
    expect(Box).toHaveTextContent('Some text here');
  });

  it('should return a text box with the correct label', () => {
    render(<GlobalTextBox
      inputProps={{ 'data-testid': 'test-box' }}
      id="test-box-id"
      label="test-label"
      value="Some text here"
    />);

    const Box = screen.getByLabelText('test-label');
    expect(Box).toHaveTextContent('Some text here');
  });

  it('snapshot should match for default values', () => {
    const snapshot = renderer.create(<GlobalTextBox
      inputProps={{ 'data-testid': 'test-box' }}
      id="test-box-id"
    />).toJSON();

    expect(snapshot).toMatchSnapshot();
  });

  it('snapshot should match for different than default values', () => {
    const snapshot = renderer.create(<GlobalTextBox
      inputProps={{ 'data-testid': 'test-box' }}
      id="test-box-id"
      label="test-label"
      rows={4}
      value="Some text here"
    />).toJSON();

    expect(snapshot).toMatchSnapshot();
  });

  it('should complete the on change function when a change occurs', () => {
    const mockFunc = jest.fn();

    render(<GlobalTextBox
      inputProps={{ 'data-testid': 'test-box' }}
      id="test-box-id"
      onChange={mockFunc}
    />);

    const userInput = 'Hello, World!';
    userEvent.type(screen.getByTestId('test-box'), userInput);

    expect(mockFunc).toHaveBeenCalledTimes(userInput.length);
  });
});
