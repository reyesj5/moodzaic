import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('App (root) component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
