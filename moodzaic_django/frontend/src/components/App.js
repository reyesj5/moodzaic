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
import {getProfile, getUserByUsername} from '../integration_funcs';

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
        },
        profile: {
          username: '',
          age: 0,
          gender: '',
          user: {},
          reminderList: [],
        },
        MyCommunityList: [],
        MyObservationList: [],
        LastObservationTime: '',
        Age: 0,
        Gender: 'F',
        ProgressScore: 0
  }


  // LogIn = (u) => {
  //   this.setState(prevState => ({
  //     LoggedIn: true,
  //     user: {
  //       username: u.username,
  //       password: u.password,
  //       email: u.email,
  //       first_name: u.first_name,
  //       last_name: u.last_name,
  //     }
  //     }))
  //     getProfile(u.username).then(p => {
  //     console.log('profile', p)
  //   })
  // }
    LogIn = (u) => {
      getProfile(u.username).then(p => {
        console.log({p})
        if (p) {
          this.setState(prevState => ({
            LoggedIn: true,
            user: {
              username: u.username,
              password: u.password,
              email: u.email,
              first_name: u.first_name,
              last_name: u.last_name,
            },
            profile: {
              username: p.username,
              age: p.age,
              gender: p.gender,
              user: p.user,
              reminderList: p.reminderList//.split(";"),
            }
          }))
      };
      })
    console.log('login called', this.state);
  }

  resetProfile = (username) => {
    getProfile(username).then(p => {
      if (p) {
        this.setState(prevState => ({
          profile: {
            username: p.username,
            age: p.age,
            gender: p.gender,
            user: p.user,
            reminderList: p.reminderList//.split(";"),
          }
        }))
    };
    })
    getUserByUsername(username).then(u => {
      if (u) {
        this.setState(prevState => ({
          user: {
            username: u.username,
            password: u.password,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
          }
        }))
    };
    })
  console.log('resetProfile called', this.state);
}

  LogOut = () => {
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
              {this.state.LoggedIn ?
                <div>
                  <MyMenu callback={this.LogOut}/>
                  <MoodPage profile={this.state.profile}/>
                  <Footer/>
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
                  <ProfilePage callback={this.resetProfile} User={this.state.user} Profile={this.state.profile}/>
                  <Footer/>
                </div> :
                <Redirect to="/" />
              }
            </Route>
            <Route path="/Communities">
              {this.state.LoggedIn ?
                <div>
                  <MyMenu callback={this.LogOut}/>
                  <CommunityPage user={this.state.user}/>
                  <Footer/>
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
