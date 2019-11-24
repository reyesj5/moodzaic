import React from 'react'
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown
} from 'semantic-ui-react'
import MyMenu from './Menu.js';
import Footer from './Footer.js';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class MoodVis extends React.Component {
  render() {
    return(
      <div>
        <p>Visualize this!</p>
      </div>
    )
  }
}

export default MoodVis
