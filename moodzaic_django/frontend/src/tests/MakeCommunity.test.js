import React from 'react';
import ReactDOM from 'react-dom';
import MakeCommunity from '../components/MakeCommunity';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('MakeCommunity component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MakeCommunity />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
