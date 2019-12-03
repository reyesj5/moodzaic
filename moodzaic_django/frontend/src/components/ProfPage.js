import React from 'react'
import {
  Container,
  Grid,
  Header,
  Icon,
  Button,
  Segment
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';
import Reminders from './Reminders.js';
import UpdateProfile from './UpdateProfile.js';
import {getProfile, updateObservation} from '../integration_funcs.js'
import MoodVis from './MoodVis.js'

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
        <UpdateProfile 
          user={user} 
          profile={profile} 
          callback={this.toggleEditMode}
          updateProfile={this.props.updateProfile}
          updateUser={this.props.updateUser}
        />
        :
        <div>
          <Segment vertical>
            <Grid inverted columns={2}>
              <Grid.Column width = {10}>
                <Container text style={{ margin: '6em 0em 0em', padding: '0em 1em' }}>
                {//style={{ marginTop: '7em', marginLeft: '10em' }}>
                }
                  <Header as='h1'>
                    {user.username}'s Profile
                  </Header>
                  <Button icon onClick={this.toggleEditMode}>
                    <Icon name="edit outline"/>
                  </Button>
                  <p>My name? <strong>{user.first_name} {user.last_name}</strong></p>
                  <p>My age? <strong>{profile.age}</strong></p>
                  {profile.gender === '' ? '' : <p>My Gender? <strong>{profile.gender}</strong></p>}
                  <MoodVis profile={profile}/>
                </Container>
              </Grid.Column>
              <Grid.Column width = {5} style={{ margin: '4.5em 0em 0em', padding: '0em 0em' }}>
                <Reminders 
                  profile={profile} 
                  updateProfile={this.props.updateProfile}
                  updateUser={this.props.updateUser}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      }
      </div>
    )

  }
}

export default ProfilePage;
