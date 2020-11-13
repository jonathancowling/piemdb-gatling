import React from 'react';
import each from 'jest-each';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import ExtraFields from './ExtraFields.jsx';

afterEach(cleanup);

describe('/components/SubmitPieComponents/ExtraFields.jsx', () => {
  it('Should return a recipe link field, when passed a Recipe', () => {
    render(<ExtraFields
      field='Recipe'
      blockFormSetter={() => {}}
      values={{
        link: '',
        location: '',
        restaurant: '',
        cost: '',
        shop: '',
      }}
      fieldsChanged={() => {}}/>);

    // expect the global text boxes with the correct labels to exist
    expect(screen.getByLabelText('Recipe link')).toBeTruthy();
  });

  each([
    [
      'Restaurant',
    ],
    [
      'Location',
    ],
    [
      'Cost',
    ],
  ]).it('Should return a restaurants fields, when passed a Restaurant', (field) => {
    render(<ExtraFields
      field='Restaurant'
      blockFormSetter={() => {}}
      values={{
        link: '',
        location: '',
        restaurant: '',
        cost: '',
        shop: '',
      }}
      fieldsChanged={() => {}}/>);

    // {
    //   field,
    //   blockFormSetter,
    //   values,
    //   fieldsChanged,
    // }

    // expect the global text boxes with the correct labels to exist
    expect(screen.getByLabelText(field)).toBeTruthy();
  });

  each([
    [
      'Shop',
    ],
    [
      'Location',
    ],
    [
      'Cost',
    ],
  ]).it('Should return a shop fields, when passed a Shop', (field) => {
    render(<ExtraFields
      field='Shop'
      blockFormSetter={() => {}}
      values={{
        link: '',
        location: '',
        restaurant: '',
        cost: '',
        shop: '',
      }}
      fieldsChanged={() => {}}/>);

    // expect the global text boxes with the correct labels to exist
    expect(screen.getByLabelText(field)).toBeTruthy();
  });
});
