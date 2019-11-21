//display errors maybe but like we can just not test this maybe

import React from 'react';
import ReactDOM from 'react-dom';
import SignUpForm from '../components/SignUp';
import { BrowserRouter as Router, Link } from "react-router-dom";

describe('SignUp', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <SignUpForm />
      </ Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
