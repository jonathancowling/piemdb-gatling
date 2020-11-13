import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      'font-family': 'Catamaran',
      'font-size': '1.25rem',
      'font-style': 'normal',
      'font-weight': 700,
      'line-height': '2rem',
      'letter-spacing': '0em',
      'text-align': 'center',
      'border-color': '#0a46a6',
      color: '#0a46a6',
      '&:hover': {
        'font-family': 'Catamaran',
        'font-size': '1.25rem',
        'font-style': 'normal',
        'font-weight': 700,
        'line-height': '2rem',
        'letter-spacing': '0em',
        'text-align': 'center',
        'border-color': '#0a46a6',
        'background-color': '#0a46a6',
        color: '#f8f8f8',
      },
    },
  },
}));

export default useStyles;
