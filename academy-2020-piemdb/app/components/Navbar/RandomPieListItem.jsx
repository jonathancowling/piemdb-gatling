import React from 'react';
import { useHistory } from 'react-router-dom';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import CasinoIcon from '@material-ui/icons/Casino';
import randomPie from '../../api/getRandPie';

const RandomPieListItem = () => {
  const history = useHistory();

  return (
    <ListItem button key={'RandomPie'} onClick={async () => {
      const id = await randomPie();
      history.push(`/pie-page/${id}`);
    }}>
      <ListItemIcon> <CasinoIcon /> </ListItemIcon>
      <ListItemText primary={'Random Pie'} />
    </ListItem>

  );
};

export default RandomPieListItem;
