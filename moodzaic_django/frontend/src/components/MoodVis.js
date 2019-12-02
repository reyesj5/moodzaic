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
// import '...../node_modules/react-vis/dist/style.css';
import '../../../../node_modules/react-vis/dist/style.css';

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
    ],
    sampleObs: {
      date: "00:55:11:27:11:19", //my guess at formatting Nov. 27 2019, 11:55 PM
      sleep: 7.5,
      exercise: 1,
      meals: 3,
      work: 9,
      user: {},
      predictedMood: 5, //I think it's between 0 and 5,
      mood: 4
    }
  }

  componentDidMount() {
    const observations = getUserObservations(this.props.profile.username)
    this.setState({pastObservations: observations})
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  organizeMoodData(observations) {
    //Past 10 moods to display in graph
    //My looping here is kind of ugly, but I have no wifi to google JS documentation! :(
    //If there's slicing, backwards access etc like in Python
    var moods = [];
    for (var i = 1; i <= 10 && i < observations.length + 1; i++) {
      var obs = observations[observations.length - i]; //ith most recent observation
      if(obs) {
        moods[i - 1] = obs.mood
      }
    }
    var retData = [];
    for (i = 0; i < moods.length; i++) {
      retData[i] = {x: i, y: moods[moods.length - i - 1]}
    }
    console.log(retData)
    return retData;
  }

  //Returns object of three sets, one for sleep, exercise, and work
  organizeHabitData(observations) {
    var habits = [];
    for (var i = 1; i <= 10 && i < observations.length + 1; i++) {
      var obs = observations[observations.length - i]; //ith most recent observation
      if(obs) {
        habits[i - 1] = {sleep: obs.sleep, exercise: obs.exercise, work: obs.work}
      }
    }
    var retData = {sleep: [], exercise: [], work: []}
    for (i = 0; i < habits.length; i++) {
      retData.sleep[i] = {x: i, y: habits[habits.length - i - 1].sleep}
      retData.exercise[i] = {x: i, y: habits[habits.length - i - 1].exercise}
      retData.work[i] = {x: i, y: habits[habits.length - i - 1].work}
    }
    console.log(retData)
    return retData;
  }

  organizeCalData(observations) {}

  render () {
    var fakeHabits = this.organizeHabitData([this.state.sampleObs, this.state.sampleObs, this.state.sampleObs]);
    var fakeMood = this.organizeMoodData([this.state.sampleObs, this.state.sampleObs, this.state.sampleObs]);
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
              <MoodChart data={fakeMood}/> : <div/>}
            {activeItem === 'Daily Habits' ?
              <HabitChart data={fakeHabits}/> : <div/>}
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
          <XAxis />
          <YAxis tickValues={[0, 1, 3, 4, 5]} title="Mood Level"/>
          <VerticalGridLines />
          <HorizontalGridLines />
          <LineSeries data={this.props.data} color="blue"/>
        </XYPlot>
      </div>
    )
  }
}
class HabitChart extends React.Component {
  render() {
    var sleep = this.props.data.sleep
    var exercise = this.props.data.exercise
    var work = this.props.data.work
    return(
      <div>
        <h3>HabitChart</h3>
        <XYPlot height={300} width= {400} color="#cd3b54">
          <VerticalGridLines />
          <HorizontalGridLines />
          <VerticalBarSeries data={sleep} color="blue" />
          <VerticalBarSeries data={exercise} color="red" />
          <VerticalBarSeries data={work} color="yellow" />
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

export default MoodVis
