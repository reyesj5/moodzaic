import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from '../logo.png'
import {getUserByUsername} from '../integration_funcs.js';
import SetupPage from './AccountSetup.js';


import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link,
  // Redirect
} from "react-router-dom";

function isError(e) {
  return e && e.stack && e.message;
}

class SignUpForm extends React.Component {
  state = {
    redirect: false,
    user:{},
    errors: []
  }

  userCreation = (username, password) => {
    const u = {
      username: username,
      password: password
    }
    this.setState({redirect: true, user: u});
  }

  handleSubmit = (event) => {
    let username = event.target[0].value;
    let password = event.target[1].value;
    let confirm_password = event.target[2].value;
    //const [username, password, confirm_password] = event.target.map(t => t.value);
    console.log([username, password, confirm_password]);
    if (username.trim() === "") {
      this.setState({errors: ["Please enter a username"]})
      return;
    } else if (password.trim() === "") {
      this.setState({errors: ["Please enter a password"]})
      return;
    } else if (confirm_password.trim() === "") {
      this.setState({errors: ["Please confirm your password"]})
      return;
    }
    if (password === confirm_password) {
      getUserByUsername(username).then(user => {
        if(!isError(user)) {
          this.setState ({errors: ["An account with that username already exists"]})
          return;
        }
        this.userCreation(username, password);
      })
      //console.log([username, password]);
    } else {
      this.setState ({errors: ["Please enter matching passwords"]})
      return;
    }
  }

  render() {
    const {errors} = this.state;
    const {redirect} = this.state;
    if (redirect) {
       // return <Redirect to='/Welcome'/>;
       return <SetupPage user={this.state.user} callback={this.props.callback}/>
     }
    return(
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            <Image src={logo} /> Sign up for an account
          </Header>
          <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
          <Form size='large'  onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm Password'
                type='password'
              />
              <Button color='teal' fluid size='large'>
                Sign Up
              </Button>
            </Segment>
          </Form>
          <Message>
            Already have an account? <Link to='/'>Log In</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default SignUpForm
