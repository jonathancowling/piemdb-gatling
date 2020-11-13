import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GlobalTextBox from '../GlobalComponents/GlobalTextBox/GlobalTextBox.jsx';
import GlobalTextLengthSanitiser from '../GlobalComponents/GlobalTextSanitisers/GlobalTextLengthSanitiser.jsx';
import GlobalURLSanitiser from '../GlobalComponents/GlobalTextSanitisers/GlobalURLSanitiser.jsx';
import { GlobalPriceSanitiser } from '../GlobalComponents/GlobalTextSanitisers/GlobalPriceSanitiser.jsx';

const ExtraFields = ({
  field,
  blockFormSetter,
  values,
  fieldsChanged,
}) => {
  const maxRestaurantNameLength = 50;
  const maxShopNameLength = 25;
  const maxLocationNameLength = 25;

  const [urlBlocker, setUrlBlocker] = useState(true);
  const urlError = 'Please enter a valid URL';

  const [restaurantNameLength, setRestaurantNameLength] = useState(0);
  const [restaurantNameBlocker, setRestaurantNameBlocker] = useState(false);
  const handleRestaurantNameChange = (event) => setRestaurantNameLength(event.target.value.length);
  const restaurantNameError = 'This Restaurant name is too long';

  const [shopNameLength, setShopNameLength] = useState(0);
  const [shopNameBlocker, setShopNameBlocker] = useState(false);
  const handleShopNameChange = (event) => setShopNameLength(event.target.value.length);
  const shopNameError = 'This Shop name is too long';

  const [locationNameLength, setLocationNameLength] = useState(0);
  const [locationNameBlocker, setLocationNameBlocker] = useState(false);
  const handleLocationNameChange = (event) => setLocationNameLength(event.target.value.length);
  const locationNameError = 'This Location name is too long';

  const [costBlocker, setCostBlocker] = useState(true);
  const costError = 'Please enter a valid price in £ e.g. £10.99';

  const handleSet = (event) => {
    if (
      event.target.id === 'restaurant-location-box'
      || event.target.id === 'shop-location-box'
    ) {
      fieldsChanged({ ...values, location: event.target.value });
      handleLocationNameChange(event);
    } else if (event.target.id === 'recipe-link') {
      fieldsChanged({ ...values, link: event.target.value });
    } else if (
      event.target.id === 'shop-cost-box'
      || event.target.id === 'restaurant-cost-box'
    ) {
      fieldsChanged({ ...values, cost: event.target.value });
    } else if (event.target.id === 'shop-box') {
      fieldsChanged({ ...values, establishment: event.target.value });
      handleShopNameChange(event);
    } else if (event.target.id === 'restaurant-box') {
      fieldsChanged({ ...values, establishment: event.target.value });
      handleRestaurantNameChange(event);
    }
  };

  if (field === 'Recipe') {
    blockFormSetter(urlBlocker);
    return (
      <>
        <GlobalTextBox
          label="Recipe link"
          id="recipe-link"
          onChange={handleSet}
          value={values.link}
        />
        <GlobalURLSanitiser
          url={values.link}
          message={urlError}
          blockFormSetter={setUrlBlocker}
        />
      </>
    );
  }
  if (field === 'Restaurant') {
    blockFormSetter(restaurantNameBlocker || locationNameBlocker);
    return (
      <>
        <GlobalTextBox
          label="Restaurant"
          id="restaurant-box"
          inputProps={{ 'data-testid': 'restaurant-test' }}
          onChange={handleSet}
          value={values.establishment}
        />
        <GlobalTextLengthSanitiser
          textLength={restaurantNameLength}
          maxTextLength={maxRestaurantNameLength}
          message={restaurantNameError}
          blockFormSetter={setRestaurantNameBlocker}
        />
        <div>
          <br></br>
        </div>
        <GlobalTextBox
          label="Location"
          id="restaurant-location-box"
          inputProps={{ 'data-testid': 'location-test' }}
          onChange={handleSet}
          value={values.location}
        />
        <GlobalTextLengthSanitiser
          textLength={locationNameLength}
          maxTextLength={maxLocationNameLength}
          message={locationNameError}
          blockFormSetter={setLocationNameBlocker}
        />
        <div>
          <br></br>
        </div>
        <GlobalTextBox
          label="Cost"
          id="restaurant-cost-box"
          inputProps={{ 'data-testid': 'cost-test' }}
          onChange={handleSet}
          value={values.cost}
        />
        <GlobalPriceSanitiser price={values.cost} message={costError} />
      </>
    );
  }
  if (field === 'Shop') {
    blockFormSetter(shopNameBlocker || locationNameBlocker || costBlocker);
    return (
      <>
        <GlobalTextBox
          label="Shop"
          id="shop-box"
          onChange={handleSet}
          value={values.establishment} />
        <GlobalTextLengthSanitiser
          textLength={shopNameLength}
          maxTextLength={maxShopNameLength}
          message={shopNameError}
          blockFormSetter={setShopNameBlocker}
        />
        <div>
          <br></br>
        </div>
        <GlobalTextBox
          label="Location"
          id="shop-location-box"
          onChange={handleSet}
          value={values.location}
        />
        <GlobalTextLengthSanitiser
          textLength={locationNameLength}
          maxTextLength={maxLocationNameLength}
          message={locationNameError}
        />
        <div>
          <br></br>
        </div>
        <GlobalTextBox
          label="Cost"
          id="shop-cost-box"
          onChange={handleSet}
          value={values.cost} />
        <GlobalPriceSanitiser
          price={values.cost}
          message={costError}
          blockFormSetter={setCostBlocker}
        />
      </>
    );
  }
  return null;
};

ExtraFields.propTypes = {
  field: PropTypes.string.isRequired,
  fieldsChanged: PropTypes.func.isRequired,
  values: PropTypes.object,
  blockFormSetter: PropTypes.func.isRequired,
};

ExtraFields.defaultProps = {
  blockFormSetter: () => {},
};

export default ExtraFields;
