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

import {
  BrowserRouter as Router,
  Switch,
  Route,
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

class MoodPage extends React.Component {
  state = {
    QuestionList: getDailyQuestions(),
  }
  render() {
    const {QuestionList} = this.state;
    return(
      <div>
        <MyMenu />
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1'>How are you feeling?</Header>
          <p>Some ~important~ questions for you about your mood today.</p>
          {QuestionList.map((Question, index) => {
            return (<Form>
              <Form.Field>
                <label>{Question}</label>
                <input />
              </Form.Field>
            </Form>)})}
            <Form>
              <Form.Field>
                <label>Mood</label>
                <Dropdown placeholder='Select'
                  fluid selection options={[
                    {value:"grumpy" ,text:"grumpy"},
                    {value:"big mood", text:"big mood"},
                    {value:"nibblish", text:"nibblish"}]} />
              </Form.Field>
            </Form>
            <br />
          <Link to="/Profile">
            <Button color='teal' fluid size='large'>
              Submit
            </Button>
          </Link>
        </Container>
        <Footer />
      </div>
    )
  }
}

export default MoodPage;
