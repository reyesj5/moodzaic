import React, { Component } from 'react';
// import '../App.css';
import LoginForm from './LogIn.js'
import ProfilePage from './ProfPage.js'
import MoodPage from './MoodInput.js'
import CommunityPage from './CommunityPage.js'
import SignUpForm from './SignUp.js'
import SetupPage from './AccountSetup.js'
// import MyMenu from './Menu.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

class App extends Component {

  state = {
        LoggedIn: false,
        user: {
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: ''
        },
        MyCommunityList: [],
        MyObservationList: [],
        LastObservationTime: '',
        Age: 0,
        Gender: 'F',
        ProgressScore: 0
  }


  LogIn = (u) => {
      this.setState(prevState => ({
        LoggedIn: true,
        user: {
          username: u.username,
          password: u.password,
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name
        }
      }));
    console.log('login called', this.state);
  }

  LogOut = (u) => {
      this.setState(prevState => ({
        LoggedIn: false,
        user: {
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: ''
        }}))
  }

  render() {
    console.log('apps state:',this.state);
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/signup">
              <SignUpForm />
            </Route>
            <Route path="/MyMood">
              <MoodPage />
            </Route>
            <Route path="/Login">
              <LoginForm callback = {this.LogIn} />
            </Route>
            <Route path="/Welcome">
              <SetupPage />
            </Route>
            <Route path="/Profile">
              <ProfilePage User={this.state.user}/>
            </Route>
            <Route path="/Communities">
              <CommunityPage user={this.state.user}/>
            </Route>
            <Route path="/">
              {this.state.LoggedIn ?
                <Redirect to="/Profile" /> :
                <LoginForm callback = {this.LogIn} />
              }
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}


export default App;
