import React from 'react'
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown,
  Menu,
  Input,
  Segment
} from 'semantic-ui-react'
import MyMenu from './Menu.js';
import Footer from './Footer.js';
// import {
//   XYPlot, XAxis, YAxis,
//   VerticalGridLines,
//   HorizontalGridLines,
//   LineSeries
// } from 'react-vis';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class MoodVis extends React.Component {
  state = {
    activeItem: "mood",
    data: [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ]
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const {activeItem} = this.state.activeItem;
    return(
      <div>
        <p>Mood visualizations will go here.</p>
        <div>
          <Menu pointing>
            <Menu.Item
              name='Your Mood'
              active={activeItem === 'mood'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Daily Habits'
              active={activeItem === 'habits'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Calendar'
              active={activeItem === 'calendar'}
              onClick={this.handleItemClick}
            />
          </Menu>
          <Segment attached='bottom'>
          </Segment>
        </div>
      </div>
    )
  }
}
          // <MoodChart type={this.state.activeItem} />
//
// class MoodChart {
//   render() {
//     return(
//     <XYPlot height={300} width= {300}>
//       <VerticalGridLines />
//       <HorizontalGridLines />
//       <XAxis />
//       <YAxis />
//       <LineSeries data={this.props.data} />
//     </XYPlot>
//   )
//   }
// }

export default MoodVis
