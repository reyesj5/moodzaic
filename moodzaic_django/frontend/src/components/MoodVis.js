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
    activeItem: "Your Mood",
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
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    console.log(this.state.activeItem)
  }
  render () {
    var activeItem = this.state.activeItem;
    console.log("rendering: " + activeItem)
    return(
      <div>
        <p>Mood visualizations will go here.</p>
        <div>
          <Menu pointing>
            <Menu.Item
              name='Your Mood'
              active={activeItem === 'Your Mood'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Daily Habits'
              active={activeItem === 'Daily Habits'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='Calendar'
              active={activeItem === 'Calendar'}
              onClick={this.handleItemClick}
            />
          </Menu>
          <Segment fixed='bottom'>

            {activeItem === 'Your Mood' ?
              <MoodChart /> : <div/>}
            {activeItem === 'Daily Habits' ?
              <HabitChart /> : <div/>}
            {activeItem === 'Calendar' ?
              <CalChart /> : <div/>}
          </ Segment>
        </div>
      </div>
    )
  }
}


// {console.log(this.state.activeItem === 'Your Mood')}
// {console.log(activeItem === 'Your Mood')}

class MoodChart extends React.Component {
  render() {
    return(
      <div>
        <h3>MoodChart</h3>
      </div>
    )
  }
}
class HabitChart extends React.Component {
  render() {
    return(
      <div>
        <h3>HabitChart</h3>
      </div>
    )
  }
}
class CalChart extends React.Component {
  render() {
    return(
      <div>
        <h3>CalChart</h3>
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
