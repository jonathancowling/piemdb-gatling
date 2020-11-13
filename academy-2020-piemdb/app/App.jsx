import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import PiePage from './pages/PiePage/PiePage.jsx';
import SubmitForm from './pages/SubmitPiePage/SubmitPiePage.jsx';
import Navbar from './components/Navbar/Navbar.jsx';

const App = () => (
  <Router>
    <Navbar/>
    <Switch>
      <Route path='/pie-page/:pieId'>
        <PiePage/>
      </Route>
      <Route path='/submitForm'>
        <SubmitForm/>
      </Route>
      <Route path='/search/:query'>
        <Search/>
      </Route>
      <Route path='/'>
        <Home/>
      </Route>
    </Switch>
  </Router>
);

export default App;
