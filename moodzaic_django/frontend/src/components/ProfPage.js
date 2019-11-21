import React from 'react'
import {
  Container,
  Grid,
  Header,
} from 'semantic-ui-react'
import MyMenu from './Menu.js';
import Footer from './Footer.js';
import Reminders from './Reminders.js';
import {getProfile} from '../integration_funcs.js'

class ProfilePage extends React.Component {
  gettingProf = () => {
    return getProfile(this.props.User.username)
  }

  render() {
    const user = this.props.User;
    const profile = this.gettingProf;

    return(
      <div>
        <MyMenu />
        <Grid columns={2}>
          <Grid.Column width = {10}>
            <Container text style={{ marginTop: '7em', marginLeft: '10em' }}>
              <Header as='h1'>{user.username}'s Profile</Header>
                <p>My name? <strong>{user.first_name} {user.last_name}</strong></p>
                <p>My age? <strong>{profile.age}</strong></p>
                <p>My Gender? <strong>{profile.gender}</strong></p>
                <p>
                Once you imput your mood, I can display your mood history here!
                </p>
              </Container>
            </Grid.Column>
            <Grid.Column width = {5}>
              <Reminders/>
            </Grid.Column>
          </Grid>
        <Footer />
      </div>
    )

  }
}

export default ProfilePage;
