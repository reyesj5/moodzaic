//selectively displays either community component, mycommunities component, or allcommunities component
import React from 'react';
import ReactDOM from 'react-dom';
import CommunityPage from '../components/CommunityPage';
// import {configure, shallow} from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

describe('CommunityPage component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CommunityPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

// configure({adapter: new Adapter() })
//
// describe('CommunityPage', () => {
//   //beforeEach stuff
//   it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<CommunityPage />, div);
//     ReactDOM.unmountComponentAtNode(div);
//   });
//   it("Has a Community component", () => {
//     const wrapper = shallow(<CommunityPage />)
//     expect(wrapper
//     .find('Community').debug())
//     .toEqual('<Community />');
//   });
//   it("Has a CommunitiesPage component", () => {
//     const wrapper = shallow(<CommunityPage />)
//     expect(wrapper
//     .find('CommunitiesPage').debug())
//     .toEqual('<CommunitiesPage />');
//   });
//   it("Has an AllCommunities component", () => {
//     const wrapper = shallow(<CommunityPage />)
//     expect(wrapper
//     .find('AllCommunities').debug())
//     .toEqual('<AllCommunities />');
//   });
// });
