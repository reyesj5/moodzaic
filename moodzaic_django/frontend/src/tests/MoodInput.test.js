import React from 'react';
import ReactDOM from 'react-dom';
import MoodPage from '../components/MoodInput';
import { BrowserRouter as Router, Link } from "react-router-dom";
// import { unmountComponentAtNode } from "react-dom";

describe('MoodPage component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <MoodPage />
      </ Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

// let container = null;
// beforeEach(() => {
//   // setup a DOM element as a render target
//   container = document.createElement("div");
//   document.body.appendChild(container);
// });
//
// afterEach(() => {
//   // cleanup on exiting
//   unmountComponentAtNode(container);
//   container.remove();
//   container = null;
// });
//
// describe('MoodInput', () => {
//   it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<MoodPage />, div);
//     ReactDOM.unmountComponentAtNode(div);
//   });
// })
