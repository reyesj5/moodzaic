// Displays communities user is a member of
import React from 'react';
import ReactDOM from 'react-dom';
import CommunitiesPage from '../components/MyCommunities';

describe('MyCommunities', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CommunitiesPage myCommunities={[]} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
