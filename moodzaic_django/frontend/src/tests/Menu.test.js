import React from 'react';
import ReactDOM from 'react-dom';
import MyMenu from '../components/Menu';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('Menu component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MyMenu />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
