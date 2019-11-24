import React, { Component } from 'react';
// import '../App.css';
import LoginForm from './LogIn.js'
import ProfilePage from './ProfPage.js'
import MoodPage from './MoodInput.js'
import CommunityPage from './CommunityPage.js'
import SignUpForm from './SignUp.js'
import SetupPage from './AccountSetup.js'
import MyMenu from './Menu.js';
import Footer from './Footer.js';
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
          last_name: '',
          pk: ''
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
          last_name: u.last_name,
          pk: u.pk
        }
      }));
    console.log('login called', this.state);
  }

  LogOut = () => {
      this.setState(prevState => ({
        LoggedIn: false,
        user: {
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          pk: ''
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
              {this.state.LoggedIn ?
                <div>
                  <MyMenu callback={this.LogOut}/>
                  <MoodPage />
                  <Footer />
                </div> :
                <Redirect to="/" />
              }
            </Route>
            <Route path="/Welcome">
              <SetupPage />
            </Route>
            <Route path="/Profile">
              {this.state.LoggedIn ?
                <div>
                  <MyMenu callback={this.LogOut}/>
                  <ProfilePage User={this.state.user}/>
                  <Footer />
                </div> :
                <Redirect to="/" />
              }
            </Route>
            <Route path="/Communities">
              {this.state.LoggedIn ?
                <div>
                  <MyMenu callback={this.LogOut}/>
                  <CommunityPage user={this.state.user}/>
                  <Footer />
                </div> :
                <Redirect to="/" />
              }
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
