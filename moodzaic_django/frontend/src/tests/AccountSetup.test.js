import React from 'react';
import ReactDOM from 'react-dom';
import SetupPage from '../components/AccountSetup';
import { BrowserRouter as Router} from "react-router-dom";

describe('AccountSetup component', () => {
  //beforeEach stuff
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Router>
                      <SetupPage />
                    </ Router>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
