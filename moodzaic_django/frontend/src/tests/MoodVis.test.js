//selectively displays either community component, mycommunities component, or allcommunities component
import React from 'react';
import ReactDOM from 'react-dom';
import MoodVis from '../components/MoodVis';

describe('CommunityPage component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MoodVis />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
