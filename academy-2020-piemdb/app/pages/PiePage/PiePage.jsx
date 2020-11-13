import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../../components/PieComponents/Heading.jsx';
import PiePicture from '../../components/PieComponents/PiePicture.jsx';
import { PieAboutTop, PieAboutBottom } from '../../components/PieComponents/PieAbout.jsx';
import PieReview from '../../components/PieComponents/PieReview.jsx';
import useGetPie from '../../hooks/useGetPie';
import useGetReviews from '../../hooks/useGetReview';
import {
  Banner,
  PieDetails,
  Row,
  Col,
  ButtonHolder,
  ReviewHolder,
  SubmitReviewHolder,
  SurroundingDiv,
  ReviewSectionHeader,
} from './PiePageStyles.jsx';
import GlobalButton from '../../components/GlobalComponents/GlobalButton/GlobalButton.jsx';
import SubmitReview from '../../components/RatingComponents/SubmitReview.jsx';
import SubmitError from '../../components/RatingComponents/SubmitError.jsx';

const PiePage = () => {
  const { pieId } = useParams();
  const pie = useGetPie(pieId);
  const { reviews, setReviews } = useGetReviews(pieId);

  const [showError, setShowError] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  if (!pie.name) {
    return ('loading...');
  }

  return <SurroundingDiv>
    <Banner>
      <PieDetails>
        <Heading type='main' content={pie.name}/>
        <Row>
          <Col>
            <PiePicture picture={pie.image}/>
          </Col>
          <Col>
            <PieAboutTop pie={pie} />
            <PieAboutBottom pie={pie}/>
          </Col>
        </Row>
      </PieDetails>
    </Banner>
      <ReviewSectionHeader>
        <Heading type='sub' content='Reviews'/>
        <ButtonHolder>
            <GlobalButton colour='primary' contents='Create a review' whenClicked={() => setShowReviewForm(true)}/>
        </ButtonHolder>
      </ReviewSectionHeader>
      <SubmitError show={showError} />
      <br />
      {
      showReviewForm
        ? <SubmitReviewHolder>
        <SubmitReview setReviews={setReviews} reviews={reviews}
          setShowForm={setShowReviewForm} setShowError={setShowError}/>
      </SubmitReviewHolder> : null
      }
      <br />
      <ReviewHolder>
        <PopulateReviews reviews={reviews} />
      </ReviewHolder>
  </SurroundingDiv>;
};

const PopulateReviews = ({ reviews }) => reviews.map((review) => (<PieReview
  key={review['sort-key'].substring(6)}
  review={review['review-text']}
  reviewer={review.name}
  rating={Number(review.rating)} />
));

export default PiePage;
