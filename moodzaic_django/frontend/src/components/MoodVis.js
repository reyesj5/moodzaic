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
  DiscreteColorLegend,
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
    activeItem: "Daily Habits",
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
    earliestDay: new Date(),
    noObs: false
  }

  async componentDidMount() {
    await getUserObservations(this.props.profile.username)
      .then(observations => {
        this.setState({pastObservations: observations})
        if(observations.length === 0) {
          this.setState({noObs: true})
          console.log("No observations yet for user")
        }
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
        x: new Date(hab.date).setHours(7), y: hab.sleep}
      retData.exercise[i] = {x0: new Date(hab.date).setHours(7),
        x: new Date(hab.date).setHours(14), y: hab.exercise}
      retData.work[i] = {x0: new Date(hab.date).setHours(14),
        x: new Date(hab.date).setHours(21), y: hab.work}
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
              <MoodChart data={fakeMood} numDays={this.state.numDays} noObs={this.state.noObs}/> : <div/>}
            {activeItem === 'Daily Habits' ?
              <HabitChart data={fakeHabits} dMin={this.state.earliestDay} noObs={this.state.noObs}/> : <div/>}
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
        <p>Your mood, ranked (behind the scenes) from 1-50, over the past 10 days</p>
        {this.props.noObs ? <p>~A chart will appear here once you've begun recording your moods~</p> :
          <XYPlot height={300} width= {400} yDomain={[0,50]} xDomain={[0, this.props.numDays-1]}>
            <XAxis title="Days"/>
            <YAxis title="Scaled Mood" />
            <VerticalGridLines />
            <HorizontalGridLines />
            <LineSeries data={this.props.data} color="blue"/>
          </XYPlot>
      }
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
        {this.props.noObs ? <p>~A chart will appear here once you've begun recording your moods~</p> :
          <XYPlot height={300} width= {400} xType="time"
          color="#cd3b54" yDomain={[0,12]} xDomain={[this.props.dMin, new Date().setHours(23,59,59,999)]}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <VerticalRectSeries data={sleep} color="#37268E" />
            <VerticalRectSeries data={exercise} color="#F9454B" />
            <VerticalRectSeries data={work} color="#EDCB68" />
            <XAxis title="Days" />
            <YAxis title="Hours per Day"/>
          </XYPlot>
        }
        <DiscreteColorLegend
          onItemClick={this.clickHandler}
          width={320}
          orientation="horizontal"
          items={[
            { title: "Hours of Sleep", color: "#37268E" },
            { title: "Hours of Exercise", color: "#F9454B" },
            { title: "Hours of Work", color: "#EDCB68" }
          ]}
        />
      </div>
    )
  }
}

export default MoodVis
