//render correct community and existing posts
//that means rendering the name of the community as an h1
import React from 'react';
import ReactDOM from 'react-dom';
import Community from '../components/Community';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";
// import {configure, shallow} from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

describe('Community component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Community />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
