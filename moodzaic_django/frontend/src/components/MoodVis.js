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
import {
  XYPlot, XAxis, YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  VerticalBarSeries
} from 'react-vis';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {getUserObservations} from '../integration_funcs';

class MoodVis extends React.Component {
  state = {
    activeItem: "Your Mood",
    pastObservations: [],
    sampleData: [
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
  componentDidMount() {
    console.log("Mounted")
    const observations = getUserObservations(this.props.profile.username)
    this.setState({pastObservations: observations})
  }
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }
  organizeMoodData(observations) {}
  organizeHabitData(observations) {}
  organizeCalData(observations) {}
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
              <MoodChart data={this.state.sampleData}/> : <div/>}
            {activeItem === 'Daily Habits' ?
              <HabitChart data={this.state.sampleData}/> : <div/>}
            {activeItem === 'Calendar' ?
              <CalChart data={this.state.sampleData}/> : <div/>}
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
        <XYPlot height={300} width= {400}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <VerticalBarSeries data={this.props.data} />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    )
  }
}
class HabitChart extends React.Component {
  render() {
    return(
      <div>
        <h3>HabitChart</h3>
        <XYPlot height={300} width= {400} color="#cd3b54">
          <VerticalGridLines />
          <HorizontalGridLines />
          <VerticalBarSeries data={this.props.data} />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    )
  }
}
class CalChart extends React.Component {
  render() {
    return(
      <div>
        <h3>CalChart</h3>
        <XYPlot height={300} width= {400} color="#ba4fb9">
          <VerticalGridLines />
          <HorizontalGridLines />
          <VerticalBarSeries data={this.props.data} />
          <XAxis />
          <YAxis />
        </XYPlot>
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
//       <LineSeries sampleData={this.props.sampleData} />
//     </XYPlot>
//   )
//   }
// }

export default MoodVis
