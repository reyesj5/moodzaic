import React from 'react'
import {
  Container,
  Grid,
  Header,
  Form,
  // Dropdown,
  Button,
  Message
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';

import {updateProfile, updateUser} from '../integration_funcs.js'

class UpdateProfile extends React.Component {
  state = {
    user: {},
    profile: {},
    confirming: true,
    errors: []
  }
  handleChange = (e, object, attribute) => {
    console.log(object, attribute, e.target.value);
    let obj = this.state[object];
    obj[attribute] = e.target.value;
    this.setState(prevState => ({
        [object]: obj
      }), () => console.log(this.state));
  }
  validate = () => {
    const errors = [];
    if (this.state.user.password !== this.state.user.confirmp) {
      errors.push("Please make sure your passwords match");
    }
    let newAge = Number(this.state.profile.age);
    if (newAge && ((typeof newAge !== "number") || newAge < 18 || newAge > 120)) {
      errors.push("Please enter a valid age (18 - 120)");
    }
    let newEmail = this.state.user.email;
    if (newEmail && (!newEmail.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))) {
      errors.push("Please enter a valid email address");
    }
    return errors;
  }
  handleSubmit = () => {
    const errors = this.validate();
    this.setState({errors});
    if (errors.length > 0) {
      return;
    }
    this.setState(prevState => ({
      confirming: true
    }))

    let username = this.props.user.username;
    if(this.state.password === this.state.confirmp) {
      if (this.state.user !== {}) {
        updateUser(username, this.state.user).then(response => {
          this.props.updateUser(response.data);
        }).catch(error => {
          this.setState({confirming: false});
        })
      }
      if (this.state.profile !== {}) {
        updateProfile(username, this.state.profile).then(response => {
          this.props.updateProfile(response.data);
        }).catch(error => {
          this.setState({confirming: false});
        })
      }
      // this.props.callbackback(this.props.user.username);
      this.props.callback();
    }
    else {
      this.setState({confirming: false})
    }
  }
  // handleSubmit = (user, profile) => {
  //   updateUser(user);
  //   updateProfile(profile);
  // }

  render() {
    const user = this.props.user;
    const errors = this.state.errors;
    //const profile = this.gettingProf;
    // const profile = this.props.profile;

    return(
      <div>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Container text style={{ marginTop: '-1' }}>
            <Header as='h1'>Editing {user.username}'s profile</Header>
            <p>Fill in anything about your profile you want to change!</p>
            <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
            <Form>
              <div className="two fields">
                <Form.Field name='first_name' onChange={(e) => this.handleChange(e, "user", "first_name")}>
                  <label>First Name</label>
                  <input />
                </Form.Field>
                <Form.Field name='last_name' onChange={(e) => this.handleChange(e, "user", "last_name")}>
                  <label>Last Name</label>
                  <input />
                </Form.Field>
              </div>
              <div className="three fields">
              <Form.Field name='age' onChange={(e) => this.handleChange(e, "profile", "age")}>
                <label>Age</label>
                <input placeholder='Age'/>
              </Form.Field>
              <Form.Field name='gender' onChange={(e) => this.handleChange(e, "profile", "gender")}>
                <label>Gender</label>
                <input />
              </Form.Field>
              <Form.Field name='email' onChange={(e) => this.handleChange(e, "user", "email")}>
                <label>Email</label>
                <input />
              </Form.Field>
              </div>
              <div className="two fields">
                <Form.Field name='password' onChange={(e) => this.handleChange(e, "user", "password")}>
                  <label>New Password</label>
                  <input type='password'/>
                </Form.Field>
                {this.state.confirming ?
                  <Form.Field name='password check' onChange={(e) => this.handleChange(e, "user", "confirmp")}>
                    <label>Confirm New Password</label>
                    <input type='password'/>
                  </Form.Field>
                :
                <Form.Field type='password' name='password check' onChange={(e) => this.handleChange(e, "user", "confirmp")}>
                  <label>Confirm New Password</label>
                  <input error/>
                </Form.Field>
              }
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
