import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import SvgIcon from '@material-ui/core/SvgIcon';
import NavbarStyles from './NavbarStyles.jsx';
import RandomPieListItem from './RandomPieListItem.jsx';
import LogoComponent from '../GlobalComponents/Logo.jsx';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
    </SvgIcon>
  );
}

const PersistentDrawerRight = () => {
  const classes = NavbarStyles();
  useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Could this be broken down a little bit?
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <LogoComponent height='100%' width='70px'/>
          <Typography variant='h6' className={classes.title}>
            PieMDB
          </Typography>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='end'
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='right'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* style tags remove underline and blue colour of links in navbar */}
          <Link to={'/'} style={{ color: 'black', textDecoration: 'none' }}>
            <ListItem button key={'Home'}>
              <ListItemIcon> <HomeIcon /> </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItem>
          </Link>
          <RandomPieListItem />
          {/* style tags remove underline and blue colour of links in navbar */}
          <Link to={'/submitForm'} style={{ color: 'black', textDecoration: 'none' }}>
            <ListItem button key={'SubmitPie'} >
              <ListItemIcon> <MailIcon /> </ListItemIcon>
              <ListItemText primary={'Submit Pie'} />
            </ListItem>
          </Link>
        </List>
        <Divider/>
        <List>
          <ListItem>
            <a href="https://recipies.infinipie.works/" style={{ color: 'black', textDecoration: 'none' }}>
              <ListItemText>Recipies</ListItemText>
            </a>
          </ListItem>
          <ListItem>
            <a href="http://piespace.infinipie.works/" style={{ color: 'black', textDecoration: 'none' }}>
              <ListItemText>Piespace</ListItemText>
            </a>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default PersistentDrawerRight;
