import React from 'react'
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';

import {
  BrowserRouter as Router,
  // Switch,
  // Route,
  Link
} from "react-router-dom";
import {createObservation} from "../integration_funcs"


const getDailyQuestions = () => {
  const questions = {
    sleep: "Hours of sleep",
    exercise: "Hours of exercise",
    meals: "Meals/day",
    work: "Hours of work"
  }
  return questions;
}

const getMoods = () => {
  const moods = [
    "Loathing",
    "Repugnant",
    "Revolted",
    "Revulsion",
    "Detestable",
    "Aversion",
    "Hesitant",
    "Remoresful",
    "Ashamed",
    "Ignored",
    "Victimized",
    "Powerless",
    "Vulnerable",
    "Inferior",
    "Empty",
    "Abandoned",
    "Isolated",
    "Apathetic",
    "Indifferent",
    "Inspired",
    "Open",
    "Playful",
    "Sensitive",
    "Hopeful",
    "Loving"
  ]
  return moods;
}

class MoodPage extends React.Component {
  state = {
    QuestionObj: getDailyQuestions(),
    MoodList: getMoods(),
  }
  handleChange = (name, e) => {
    this.setState(
      { [name]: e.target.value },
      () => console.log(this.state)
    )
  }
  handleMood = (e, {value}) => {
    console.log(value)
    this.setState(
      { mood: value },
      () => console.log(this.state)
    )
  }
  handleClick = () => {
    var observation = {
      sleep: this.state.sleep,
      exercise: this.state.exercise,
      meals: this.state.meals,
      work: this.state.work,
      mood: this.state.mood
    }
    createObservation(this.props.profile.username, observation)
  }

  render() {
    const {QuestionObj} = this.state;
    const {MoodList} = this.state;
                      //(e)=>this.handleMood(e)
    return(
      <div>
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1'>How are you feeling?</Header>
          <p>Some ~important~ questions for you about your mood today.</p>
          <Form>
            {Object.entries(QuestionObj).map((Question, index) => {
              return (
                <Form.Field key={index} onChange={(e)=>this.handleChange(Question[0], e)}>
                  <label>{Question[1]}</label>
                  <input type="number"/>
                </Form.Field>)})}
            <Form.Field>
                <label>Mood</label>
                <Dropdown onChange={this.handleMood.bind(this)}
                placeholder='Select' fluid search selection
                  options={MoodList.map((Mood, index) =>
                    {return({value: Mood, text: Mood})})
                  } />
            </Form.Field>
          </Form>
          <br />
          <Router>
          <Link to="/Profile">
            <Button onClick={this.handleClick} color='teal' fluid size='large'>
              Submit
            </Button>
          </Link>
          </Router>
        </Container>
      </div>
    )
  }
}

// {MoodList.map((Mood, index) => {
// return(<Dropdown placeholder='Select'
//   fluid selection options={[
//     {value:{Mood} ,text:"grumpy"},
//     {value:"big mood", text:"big mood"},
//     {value:"nibblish", text:"nibblish"}]} />)
//   })
// }

export default MoodPage;
