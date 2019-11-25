import React from 'react'
import {
  Container,
  Grid,
  Header,
  Form,
  // Dropdown,
  Button
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';

import {updateProfile, updateUser} from '../integration_funcs.js'

// const GenderOptions = [
//   { key: 'F', text: 'Female', value: 'F' },
//   { key: 'M', text: 'Male', value: 'M' },
//   { key: 'Other', text: 'Other', value: 'O' },
//   { key: 'NA', text: 'Prefer Not To Answer', value: 'NA' }
// ]

class UpdateProfile extends React.Component {
  state = {
    first: '',
    last: '',
    password: '',
    confirmp: '',
    age: 0,
    gender: '',
    email: '',
    confirming: true
  }
  handleFirstChange = (e) => this.setState({ first: e.target.value });
  handleLastChange = (e) => this.setState({ last: e.target.value });
  handlePasswordChange = (e) => this.setState({ password: e.target.value });
  handleConfirmpChange = (e) => this.setState({ confirmp: e.target.value });
  handleAgeChange = (e) => this.setState({ age: e.target.value });
  handleGenderChange = (e) => this.setState({ gender: e.target.value });
  handleEmailChange = (e) => this.setState({ email: e.target.value });

  handleSubmit = () => {
    this.setState(prevState => ({
      confirming: true
    }))

    if(this.state.first === '') {
      this.setState(prevState => ({
        first: this.props.user.first_name
      }))
    }
    if(this.state.last === '') {
      this.setState(prevState => ({
        last: this.props.user.last_name
      }))
    }
    if(this.state.password === '') {
      this.setState(prevState => ({
        password: this.props.user.password
      }))
    }
    if(this.state.age === '') {
      this.setState(prevState => ({
        age: this.props.profile.age
      }))
    }
    if(this.state.gender === '') {
      this.setState(prevState => ({
        gender: this.props.profile.gender
      }))
    }
    if(this.state.email === '') {
      this.setState(prevState => ({
        email: this.props.user.email
      }))
    }

    if(this.state.password === this.state.confirmp) {
      updateUser({
        username: this.props.username,
        password: this.state.password,
        first_name: this.state.first,
        last_name: this.state.last,
        email: this.state.email
      })
      updateProfile({
        username: this.props.profile.username,
        age: this.state.age,
        gender: this.state.gender,
        reminder_list: this.props.profile.reminder_list
      })
      this.props.callback();
    }
    else {
      this.setstate({confirming: false})
    }
  }
  // handleSubmit = (user, profile) => {
  //   updateUser(user);
  //   updateProfile(profile);
  // }

  render() {
    const user = this.props.user;
    //const profile = this.gettingProf;
    // const profile = this.props.profile;

    return(
      <div>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Container text style={{ marginTop: '-1' }}>
            <Header as='h1'>Editing {user.username}'s profile</Header>
            <p>Fill in anything about your profile you want to change!</p>
            <Form>
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
                <input />
              </Form.Field>
              <Form.Field name='email' onChange={this.handleEmailChange}>
                <label>Email</label>
                <input />
              </Form.Field>
              </div>
              <div className="two fields">
                <Form.Field name='password' onChange={this.handlePasswordChange}>
                  <label>New Password</label>
                  <input type='password'/>
                </Form.Field>
                {this.state.confirming ?
                  <Form.Field name='password check' onChange={this.handleConfirmpChange}>
                    <label>Confirm New Password</label>
                    <input type='password'/>
                  </Form.Field>
                :
                <Form.Field error type='password' name='password check' onChange={this.handleConfirmpChange}>
                  <label>Confirm New Password</label>
                  <input />
                </Form.Field>
              }
              </div>
              <div>
              <Form.Field name='goals'>
                <label>Goals</label>
                {/* note: this will probably be a predetermined checklist of some sort*/}
                <input />
              </Form.Field>
              </div>
            </Form>
            <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
              Update Account
            </Button>
          </Container>
        </Grid.Column>
      </Grid>
      </div>
    )

  }
}

export default UpdateProfile;
