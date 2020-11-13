import { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import getPie from '../api/getPie';

const useGetPie = (pieId) => {
  const [pie, setPie] = useState({});
  useEffect(() => {
    trackPromise(
      getPie(pieId).then((newPie) => setPie(newPie)),
    );
  }, [pieId]);
  return pie;
};

export default useGetPie;
