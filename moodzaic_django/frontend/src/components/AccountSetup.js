import React from 'react'

import {
  Container,
  Header,
  Form,
  Dropdown,

  Grid,
  Button,
  Rating
} from 'semantic-ui-react'
import {createUser, createProfile} from '../integration_funcs.js';
// import ProfileService from '../ProfileService.js';




import {
  // BrowserRouter as Router,
  // Switch,
  // Route,

  Link
} from "react-router-dom";


const getInitialQuestions = () => {
  //TODO integrate: get setup questions from backend
  // We might want to attach types to questions based on response needed.
  // E.g. L5 for 5-option likert, S for string, {option 1, option 2, option 3} for dropdown
  const questions = [
    "I feel depressed",
    "I wake up often during the night",
    "I have no motivation",
    "I find it difficult to think clearly",
    "I feel anxious",
    "I like smoking a cigarette",
    "I feel worried",
    "I am irritable",
    "My morale is low",
    "I have NO patience",
    "I find it hard to concentrate",
    "I am eating more than usual",
    "I get angry easily",
    "I feel nervous",
    "I feel restless",
    "I have put on weight recently",
    "I find it hard to focus on the task at hand",
    "I have difficulty sleeping",
    "I feel down",
    "I have trouble falling asleep at night",
    "I have insomnia (sleep problems, awakening at night)",
    "Restless (impatient)",
    "Food is not particularly appealing to me",
    "I am getting restful sleep",
    "I have been tense or anxious",
    "My level of concentration is excellent",
    "I have felt impatient",
    "I have felt upbeat and optimistic",
    "I have found myself worrying about my problems",
    "I have felt calm lately",
    "I have felt sad or depressed",
    "I have been irritable, easily angered",
    "I want to nibble on snacks or sweets",
    "I have been bothered by negative moods such as anger, frustration, and irritability",
    "I have been eating a lot",
    "I am satisfied with my sleep",
    "I have felt frustrated",
    "I have felt hopeless or discouraged",
    "I have felt hungry",
    "It is hard to pay attention to things",
    "I have felt happy and content",
    "My sleep has been troubled",
    "It has been difficult to think clearly",
    "I think about food a lot"
  ]
  return questions;
}

const GenderOptions = [
  { key: 'F', text: 'Female', value: 'F' },
  { key: 'M', text: 'Male', value: 'M' },
  { key: 'Other', text: 'Other', value: 'O' },
  { key: 'NA', text: 'Prefer Not To Answer', value: 'NA' }
]



class SetupPage extends React.Component {

  //Component which displays the setup page,
  //to be displayed after inputting username and password in signup

  state = {
    step: 1,
    QuestionList: getInitialQuestions(),
    AnswerList: [],

    totalSteps: 1 + getInitialQuestions().length/5, //5 questions per page
    first: '',
    last: '',
    age: 0,
    gender: '',
    email: ''
  }
  nextStep = () => {
        const { step } = this.state
        this.setState({
            step : step + 1
        })
    }
  prevStep = () => {
      const { step } = this.state
      this.setState({
          step : step - 1
      })
  }
  handleFirstChange = (e) => this.setState({ first: e.target.value });
  handleLastChange = (e) => this.setState({ last: e.target.value });
  handleAgeChange = (e) => this.setState({ age: e.target.value });
  handleGenderChange = (e) => this.setState({ gender: e.target.value });
  handleEmailChange = (e) => this.setState({ email: e.target.value });
  


  handleSubmit = () => {
    createUser({
      username: this.props.user.username,
      password: this.props.user.password,
      first_name: this.state.first,
      last_name: this.state.last,
      email: this.state.email
    })
    createProfile({
      username: this.props.user.username,
      age: this.state.age,
      gender: this.state.gender.value,
      
      reminder_list: []
    })
  }

  render() {
    // const {step} = this.state;

    const {QuestionList} = this.state;
    return(
      <div>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 1000 }}>
            <Container text style={{ marginTop: '-1' }}>
              <Header as='h1' color='teal'>Welcome to Moodzaic!</Header>
              <p>Fill out this form so we can create your account.</p>
              <Form>

              {/*creating form for basic profile info*/}

                <div className="two fields">
                  <Form.Field name='first' onChange={this.handleFirstChange}>
                    <label>First Name</label>
                    <input />
                  </Form.Field>
                  <Form.Field name='last' onChange={this.handleLastChange}>
                    <label>Last Name</label>
                    <input />
                  </Form.Field>
                </div>
                <div className="three fields">
                <Form.Field name='age' onChange={this.handleAgeChange}>
                  <label>Age</label>
                  <input placeholder='Age'/>
                </Form.Field>
                <Form.Field name='gender' onChange={this.handleGenderChange}>
                  <label>Gender</label>
                  <Dropdown placeholder='Select' fluid selection options={GenderOptions}/>
                </Form.Field>
                <Form.Field name='email' onChange={this.handleEmailChange}>
                  <label>Email</label>
                  <input />
                </Form.Field>
                </div>
              </Form>

              {/*creating 'rating' inputs for each of the initial questions*/}

              {QuestionList.map((Question, index) => {
                return (<Form key={index}>
                  <Form.Field>
                    <label>{Question}</label>
                    <Rating icon="heart" defaultRating={0} maxRating={5} size="huge" />
                  </Form.Field>
                </Form>)})}
                <Link to="/Profile">
                  <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
                    Create Account
                  </Button>
                </Link>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

/*
<Form>
  <Form.Field>
    <label>Name</label>
    <input />
  </Form.Field>
</Form>
<Form>
  <Form.Field>
    <label>Gender</label>
    <Dropdown placeholder='Select' fluid selection options={GenderOptions} />
  </Form.Field>
</Form>
<Form>
  <Form.Field>
    <label>Choose communities that might interest you</label>
  </Form.Field>
</Form>
<Link to="/MyMood">
  <Button color='teal' fluid size='large'>
    Continue
  </Button>
</Link>
*/

export default SetupPage;
