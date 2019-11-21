//make a dummy struct with all the info and test that given that struct,
//it writes those thing
//probably name as an h1 and the other stuff as ps?

import React from 'react';
import ProfilePage from '../components/ProfPage';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";

describe('ProfilePage component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <ProfilePage User={{}}/>
      </Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
