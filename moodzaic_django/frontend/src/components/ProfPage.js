import React from 'react'
import {
  Container,
  Grid,
  Header,
  Icon,
  Button
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';
import Reminders from './Reminders.js';
import UpdateProfile from './UpdateProfile.js';
import {getProfile} from '../integration_funcs.js'

class ProfilePage extends React.Component {

  state = {
    editMode: false
  }

  gettingProf = () => {
    return getProfile(this.props.User.username)
  }

  toggleEditMode= () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }))
  }


  render() {
    const user = this.props.User;
    //const profile = this.gettingProf;
    var profile = this.props.Profile;

    return(
      <div>
      {this.state.editMode ?
        <UpdateProfile user={user} profile={profile} callback={this.toggleEditMode}/>
        :
        <div>
        <Grid columns={2}>
          <Grid.Column width = {10}>
            <Container text style={{ marginTop: '7em', marginLeft: '10em' }}>
              <Header as='h1'>
                {user.username}'s Profile
                <Button icon onClick={this.toggleEditMode}>
                  <Icon name="edit outline"/>
                </Button>
              </Header>
                <p>My name? <strong>{user.first_name} {user.last_name}</strong></p>
                <p>My age? <strong>{profile.age}</strong></p>
                {profile.gender === '' ? '' : <p>My Gender? <strong>{profile.gender}</strong></p>}
                <p>
                Once you input your mood, I can display your mood history here!
                </p>
              </Container>
            </Grid.Column>
            <Grid.Column width = {5}>
              <Reminders profile={profile}/>
            </Grid.Column>
          </Grid>
        </div>
      }
      </div>
    )

  }
}

export default ProfilePage;
