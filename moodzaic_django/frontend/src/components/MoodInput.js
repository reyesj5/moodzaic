import React from 'react'
import {
  Container,
  Header,
  Form,
  Button,
  Dropdown,
  Message
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
    errors: []
  }

  handleChange = (name, e) => {
    this.setState(
      { [name]: parseInt(e.target.value) },
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

  validate = (observation) => {
    const errors = [];
    if (!observation.sleep || !(0 <= parseInt(observation.sleep) <= 24)) {
      errors.push("Please enter a value between 0 and 24 for hours of sleep");
    }
    if (!observation.exercise || !(0 <= observation.exercise <= 24)) {
      errors.push("Please enter a value between 0 and 24 for hours of exercise");
    }
    if (!observation.meals) {
      errors.push("Please enter a value for number of meals");
    }
    if (!observation.work || !(0 <= observation.work <= 24)) {
      errors.push("Please enter a value between 0 and 24 for hours of work");
    }
    if (!observation.mood) {
      errors.push("Please enter a value for mood");
    }
    if ((observation.sleep + observation.work + observation.exercise) > 24) {
      console.log("Greater than 24")
      errors.push("Total hours of sleep, work, and exercise cannot be greater than 24");
    }
    return errors;
  }

  handleClick = () => {
    var observation = {
      sleep: this.state.sleep,
      exercise: this.state.exercise,
      meals: this.state.meals,
      work: this.state.work,
      mood: this.state.mood,
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
    const errors = this.validate(observation);
    this.setState({ errors });
    if (errors.length > 0) {
      return;
    }
    createObservation(this.props.profile.username, observation)
      .then(console.log("Finished sending observation"))
  }

  render() {
    const {QuestionObj} = this.state;
    const {MoodList} = this.state;
    const { errors } = this.state;
    return(
      <div>
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1'>How are you feeling?</Header>
          <p>Some ~important~ questions for you about your mood today.</p>
          <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
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
