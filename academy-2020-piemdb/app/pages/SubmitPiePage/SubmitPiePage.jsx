import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Reaptcha from 'reaptcha';
import PropTypes from 'prop-types';
import { FormContainer, InputContainer } from './SubmitPiePageStyles.jsx';
import ExtraFields from '../../components/SubmitPieComponents/ExtraFields.jsx';
import GlobalButton from '../../components/GlobalComponents/GlobalButton/GlobalButton.jsx';
import GlobalTextBox from '../../components/GlobalComponents/GlobalTextBox/GlobalTextBox.jsx';
import submitPie from '../../api/submitPie';
import GlobalTextLengthSanitiser from '../../components/GlobalComponents/GlobalTextSanitisers/GlobalTextLengthSanitiser.jsx';
import DropDown from '../../components/SubmitPieComponents/MaterialUIDropDown.jsx';
import GlobalURLSanitiser from '../../components/GlobalComponents/GlobalTextSanitisers/GlobalURLSanitiser.jsx';

const SubmitForm = ({ history }) => {
  const maxNameLength = 50;
  const maxDescriptionLength = 240;

  const [recaptureBlockBool, setRecaptureBlockBool] = React.useState(true);

  // This will be needed for recaptcha when submit func is here
  // eslint-disable-next-line no-unused-vars
  const [recaptureToken, setRecaptureToken] = React.useState('');

  const handleRecaptureVerification = (event) => {
    setRecaptureBlockBool(false);
    setRecaptureToken(event);
  };

  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlBlocker, setImageUrlBlocker] = useState(true);
  const handleImageUrlChange = (event) => setImageUrl(event.target.value);
  const urlError = 'Please enter a valid URL';

  const [location, setLocation] = useState('');
  const [locationBlock, setLocationBlock] = useState(false);
  const onChangedLocation = (passedLocation) => {
    setLocation(passedLocation);
  };
  const [name, setName] = React.useState('');
  const [nameLength, setNameLength] = useState(0);
  const [nameBlock, setNameBlock] = useState(false);

  const handleNameChange = (event) => {
    setNameLength(event.target.value.length);
    setName(event.target.value);
  };
  const nameError = 'This name is too long';

  const [description, setDescription] = React.useState('');
  const [descriptionLength, setDescriptionLength] = useState(0);

  const [extras, setExtras] = useState({
    link: '',
    location: '',
    establishment: '',
    cost: '',
  });

  const handleChangeExtraFields = (extraState) => {
    setExtras(extraState);
  };
  const handleDescriptionChange = (event) => {
    setDescriptionLength(event.target.value.length);
    setDescription(event.target.value);
  };
  const descriptionError = 'Woooah, we love pies as much as the next guy, but this description is too long!';

  const [extraFieldsBlock, setExtraFieldsBlock] = useState(false);
  const [dropDownBlock, setDropDownBlock] = useState(true);

  const blockForm = locationBlock
    || nameBlock
    || extraFieldsBlock
    || dropDownBlock
    || recaptureBlockBool
    || imageUrlBlocker;

  let submittedPieData;
  const mySubmitHandler = async () => {
    if (location === 'Restaurant') {
      submittedPieData = {
        name,
        description,
        image: imageUrl,
        establishment: extras.establishment,
        location: extras.location,
        cost: extras.cost,
        // pieRestaurantLocation: restaurantLocation,
        // pieCostRestaurant: cost,
      };
    } else if (location === 'Recipe') {
      submittedPieData = {
        name,
        description,
        image: imageUrl,
        'recipe-link': extras.link,
      };
    } else if (location === 'Shop') {
      submittedPieData = {
        name,
        description,
        image: imageUrl,
        establishment: extras.establishment,
        location: extras.location,
        cost: extras.cost,
      };
    }
    setRecaptureBlockBool(false);
    const pieId = await submitPie(submittedPieData, recaptureToken);
    if (pieId === 'Failed captcha, please retry') {
      alert('Failed captcha, please retry');
    } else {
      history.push(`/pie-page/${pieId}`);
    }
  };

  return (
    <InputContainer>
      <FormContainer action="">
        <GlobalTextBox id="name" label="Name" onChange={handleNameChange} />
        <GlobalTextLengthSanitiser
          textLength={nameLength}
          maxTextLength={maxNameLength}
          message={nameError}
          blockFormSetter={setNameBlock}
        />
        <div>
          <br />
        </div>
        <GlobalTextBox
          id="description"
          label="Describe your pie"
          rows={4}
          onChange={handleDescriptionChange}
        />
        <GlobalTextLengthSanitiser
          textLength={descriptionLength}
          maxTextLength={maxDescriptionLength}
          message={descriptionError}
          blockFormSetter={setLocationBlock}
        />
        <div>
          <br />
        </div>
          <GlobalTextBox
            label="Image link"
            id="image-link"
            onChange={handleImageUrlChange}
          />
          <GlobalURLSanitiser
            url={imageUrl}
            message={urlError}
            blockFormSetter={setImageUrlBlocker}
          />
        <div>
          <br />
        </div>
        <DropDown
          field="location"
          onChanged={onChangedLocation}
          blockFormSetter={setDropDownBlock}
        />
        <div>
          <br />
        </div>
        <ExtraFields
          field={location}
          blockFormSetter={setExtraFieldsBlock}
          fieldsChanged={handleChangeExtraFields}
          values={extras}
        />
        <div>
          <br />
        </div>
        <GlobalButton
          colour="primary"
          contents="Submit"
          disabled={blockForm}
          whenClicked={mySubmitHandler}
        />
        <Reaptcha
          sitekey="6LceYt8ZAAAAAMFnw_5fsTYOjNXe1H3pMe_hAJ14"
          onVerify={handleRecaptureVerification}
        />
      </FormContainer>
    </InputContainer>
  );
};

SubmitForm.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SubmitForm);
