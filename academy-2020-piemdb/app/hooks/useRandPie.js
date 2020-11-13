import { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import getRandPie from '../api/getRandPie';

const useRandPie = () => {
  const [pie, setPie] = useState({});
  useEffect(() => {
    trackPromise(
      getRandPie().then((newPie) => {
        setPie(newPie);
      }),
    );
  }, []);
  return pie;
};

export default useRandPie;
