import React from 'react';
import ReactDOM from 'react-dom';
import MyMenu from '../components/Menu';
// import renderer from 'react-test-renderer';
// import { render, unmountComponentAtNode } from "react-dom";
// import { act } from "react-dom/test-utils";
import { BrowserRouter as Router} from "react-router-dom";

describe('Menu component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router>
                      <MyMenu />
                    </ Router>,
                    div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
