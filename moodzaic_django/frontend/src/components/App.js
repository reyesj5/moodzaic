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


  toggleLogIn = (u) => {
      this.setState(prevState => ({
        LoggedIn: !prevState.LoggedIn,
        user: u
      }))
  }

  render() {
    console.log('what???')
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
              <LoginForm callback = {this.toggleLogIn} />
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
                <LoginForm callback = {this.toggleLogIn} />
              }
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}


export default App;
