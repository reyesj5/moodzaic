import React from 'react';
import ReactDOM from 'react-dom';
import SetupPage from '../components/AccountSetup';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('AccountSetup component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SetupPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
