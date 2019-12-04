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
  VerticalBarSeries,
  VerticalRectSeries
} from 'react-vis';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {getUserObservations} from '../integration_funcs';
// import '...../node_modules/react-vis/dist/style.css';
import 'react-vis/dist/style.css';


class MoodVis extends React.Component {
  state = {
    activeItem: "Your Mood",
    pastObservations: [],
    sampleObs: {
      date: "00:55:11:27:11:19", //my guess at formatting Nov. 27 2019, 11:55 PM
      sleep: 7.5,
      exercise: 1,
      meals: 3,
      work: 9,
      user: {},
      predictedMood: 5, //I think it's between 0 and 5,
      mood: 4
    },
    numDays: 10,
    earliestDay: new Date()
  }

  async componentDidMount() {
    await getUserObservations(this.props.profile.username)
      .then(observations => {
        this.setState({pastObservations: observations})
      })
    const observations = this.state.pastObservations
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  organizeMoodData(observations) {
    //Past 10 moods to display in graph
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
    //console.log(retData)
    return retData;
  }

  //Returns object of three sets, one for sleep, exercise, and work
  organizeHabitData(observations) {
    var habits = [];
    for (var i = 1; i <= 10 && i < observations.length + 1; i++) {
      var obs = observations[observations.length - i]; //ith most recent observation
      if(obs) {
        habits[i - 1] = {sleep: obs.sleep, exercise: obs.exercise,
          work: obs.work, date: this.toDate(obs.date)}
      }
    }
    var retData = {sleep: [], exercise: [], work: []}
    for (i = 0; i < habits.length; i++) {
      var hab = habits[habits.length - i - 1]
      retData.sleep[i] = {x0: hab.date,
        x: new Date(hab.date).setHours(hab.date.getHours() + 1), y: hab.sleep}
      retData.exercise[i] = {x0: hab.date, x: hab.date, y: hab.exercise}
      retData.work[i] = {x0: hab.date, x: hab.date, y: hab.work}
      if (hab.date.getTime() < this.state.earliestDay) {
        this.setState({earliestDay: hab.date})
      }
    }
    console.log(retData)
    return retData;
  }

  toDate(dateStr) {
    var parts = dateStr.split("-")
    return new Date(parts[0], parts[1] - 1, parts[2])
  }

  render () {
    var fakeHabits = this.organizeHabitData(this.state.pastObservations);
    var fakeMood = this.organizeMoodData(this.state.pastObservations);
    var activeItem = this.state.activeItem;
    return(
      <div>
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
          </Menu>
          <Segment fixed='bottom'>

            {activeItem === 'Your Mood' ?
              <MoodChart data={fakeMood} numDays={this.state.numDays}/> : <div/>}
            {activeItem === 'Daily Habits' ?
              <HabitChart data={fakeHabits} dMin={this.state.earliestDay}/> : <div/>}
          </ Segment>
        </div>
      </div>
    )
  }
}

class MoodChart extends React.Component {
  render() {
    return(
      <div>
        <h3>MoodChart</h3>
        <p>Your mood, ranked (behind the scenes) from 0-5, over the past 10 days</p>
        <XYPlot height={300} width= {400} yDomain={[0,50]} xDomain={[0, this.props.numDays-1]}>
          <XAxis title="Days"/>
          <YAxis title="Scaled Mood" />
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
        <p>Your sleep, exercise, and work hours over the past 10 days</p>
        <XYPlot height={300} width= {400} xType="time"
        color="#cd3b54" yDomain={[0,12]} xDomain={[this.props.dMin, new Date()]}>
          <VerticalGridLines />
          <XAxis title="Days" />
          <YAxis title="Hours per Day"/>
          <HorizontalGridLines />
          <VerticalRectSeries data={sleep} color="blue" />
          <VerticalRectSeries data={exercise} color="red" />
          <VerticalRectSeries data={work} color="yellow" />
        </XYPlot>
      </div>
    )
  }
}

export default MoodVis
