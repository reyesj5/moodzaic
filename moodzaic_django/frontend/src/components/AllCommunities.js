import React from 'react'
import {
  Container,
  Button,
} from 'semantic-ui-react'

// import { addCommunity, isMyCommunity } from '../integration_funcs.js'
// import CommunityService from '../CommunityService.js';
// import UserService from '../UserService.js';
import MakeCommunity from './MakeCommunity.js';
import {updateCommunity} from '../integration_funcs'





class AllCommunities extends React.Component {
  state = {
    makeMode: false
    // profile: {}
  }

  componentDidUpdate() {
    console.log(this.state, this.props);
  }

  handleAddClick(community) {
    // var username = this.state.Username;
    // var user_plus_community = {
    //   User: username,
    //   Community: community
    // }
    updateCommunity(community);
  }

  toggleMakeMode = () => {
    this.setState(prevState => ({
      makeMode: !prevState.makeMode
    }))
  }

  MakeModeOn = () => {
    this.setState(prevState => ({
      makeMode: true
    }))
  }

  render() {
    const communities = this.props.allCommunities.map((com, i) => {
      return <Button
                color='purple' fluid size='large'
                key = {i} onClick = {this.handleAddClick({name: com.name, users: com.users.push(this.props.user.username)})}>
                {com.name}: {this.props.myCommunities.includes(com) ? 'added!' : 'add?'}
              </ Button>;
    })

    const makeCommunityButton =
      <Button
        color='orange' fluid size='large'
        onClick = {this.MakeModeOn}>
        {'Create a new community!'}
      </ Button>;

    // let myPage;
    //
    // if(this.state.makeMode === false) {
    //   myPage = <MakeCommunity callback={this.toggleMakeMode()} user={this.props.user}/>
    // }
    //
    // else {
    //   myPage =
    //   <Container text style={{ marginTop: '7em' }}>
    //   {communities}
    //   <p> don't see any you like? </p>
    //   {makeCommunityButton}
    //   </Container>
    // }

    return (
      <div>
        {(this.state.makeMode === true) ?
          <MakeCommunity callback={this.toggleMakeMode} user={this.props.user}/>
          :
          <Container text style={{ marginTop: '7em' }}>
          {communities}
          <p> don't see any you like? </p>
          {makeCommunityButton}
          </Container>
        }
      </div>
    )
  }

}


export default AllCommunities
