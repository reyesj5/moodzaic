import React from 'react';
import ReactDOM from 'react-dom';
import AllCommunities from '../components/AllCommunities';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('AllCommunities component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AllCommunities />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
