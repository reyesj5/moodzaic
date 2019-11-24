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


const getDailyQuestions = () => {
  const questions = [
    "Hours of sleep",
    "Hours of exercise",
    "Meals/day",
    "Hours of work"
  ]
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
    QuestionList: getDailyQuestions(),
    MoodList: getMoods()
  }
  render() {
    const {QuestionList} = this.state;
    const {MoodList} = this.state;
    return(
      <div>
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1'>How are you feeling?</Header>
          <p>Some ~important~ questions for you about your mood today.</p>
          {QuestionList.map((Question, index) => {
            return (<Form key={index}>
              <Form.Field>
                <label>{Question}</label>
                <input />
              </Form.Field>
            </Form>)})}
            <Form>
              <Form.Field>
                <label>Mood</label>
                <Dropdown placeholder='Select' fluid search selection
                  options={MoodList.map((Mood, index) =>
                    {return({value: Mood, text: Mood})})
                  } />
              </Form.Field>
            </Form>
            <br />
          <Router>
          <Link to="/Profile">
            <Button color='teal' fluid size='large'>
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
