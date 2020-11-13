import { useState, useEffect } from 'react';
import { getReviewsForPie } from '../api/submitReviewAPI';

const useGetReviews = (pieId) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      const newReviews = await getReviewsForPie(pieId);
      setReviews(newReviews);
    };
    getReviews();
  }, [pieId]);
  return { reviews, setReviews };
};

export default useGetReviews;
