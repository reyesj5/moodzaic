//selectively displays either community component, mycommunities component, or allcommunities component
import React from 'react';
import ReactDOM from 'react-dom';
import CommunityPage from '../components/CommunityPage';
// import {configure, shallow} from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router} from "react-router-dom";

describe('CommunityPage component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <CommunityPage />
      </ Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
