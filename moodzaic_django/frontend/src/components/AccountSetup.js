import React from 'react'

import {
  Container,
  Header,
  Form,
  // Dropdown,
  Grid,
  Button,
  Message
  // Rating
} from 'semantic-ui-react'
import {createProfile} from '../integration_funcs.js';
// import ProfileService from '../ProfileService.js';
import {Redirect} from "react-router-dom";




// import {
//   // BrowserRouter as Router,
//   // Switch,
//   // Route,
//
//   Link
// } from "react-router-dom";



class SetupPage extends React.Component {

  //Component which displays the setup page,
  //to be displayed after inputting username and password in signup

  state = {
    first: '',
    last: '',
    age: 0,
    gender: '',
    email: '',
    errors: [],
    finished: false
  }
  handleFirstChange = (e) => this.setState({ first: e.target.value });
  handleLastChange = (e) => this.setState({ last: e.target.value });
  handleAgeChange = (e) => this.setState({ age: e.target.value });
  handleGenderChange = (e) => this.setState({ gender: e.target.value });
  handleEmailChange = (e) => this.setState({ email: e.target.value });

  validate = () => {
    const errors = [];
    if (this.state.first.trim() === "" || this.state.last.trim() === "") {
      errors.push("Please enter your name");
    }
    if (this.state.age < 18 || this.state.age > 120) {
      errors.push("Please enter a valid age (18 - 120)");
    }
    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      errors.push("Please enter a valid email address");
    }
    // if (this.state.goals.trim() === "") {
    //   errors.push("Please enter a goal. You can always change it later.");
    // }
    console.log(this.state)
    return errors;
  }

  handleSubmit = async () => {
    const errors = this.validate();
    this.setState({ errors });
    console.log(this.state.errors)
    if (errors.length > 0) {
      return;
    }
    await createProfile({
      username: this.props.user.username,
      age: this.state.age,
      gender: this.state.gender.value,
      user: {
        username: this.props.user.username,
        password: this.props.user.password,
        first_name: this.state.first,
        last_name: this.state.last,
        email: this.state.email
      }
    })
    console.log("No errors, creating account")
    this.setState({finished: true})
    this.props.callback(this.props.user)
  }

  render() {
    // const {step} = this.state;
    const errors = this.state.errors;
    // const {QuestionList} = this.state;
    return(
      <div>
        {this.state.finished ? <Redirect to="/" /> : <div></div>}
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 1000 }}>
            <Container text style={{ marginTop: '-1' }}>
              <Header as='h1' color='teal'>Welcome to Moodzaic!</Header>
              <p>Fill out this form so we can create your account.</p>
              <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
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
                  <input type='number' />
                </Form.Field>
                <Form.Field name='gender' onChange={this.handleGenderChange}>
                  <label>Gender Identity</label>
                  <input />
                </Form.Field>
                <Form.Field name='email' onChange={this.handleEmailChange}>
                  <label>Email</label>
                  <input />
                </Form.Field>
                </div>
              </Form>
              <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
                  Create Account
              </Button>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default SetupPage;
