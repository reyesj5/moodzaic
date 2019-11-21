import React from 'react';
import ReactDOM from 'react-dom';
import Reminders from '../components/Reminders';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";

describe('Reminders component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Reminders />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
