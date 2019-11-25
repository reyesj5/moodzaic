import React from 'react'
import {
  Container,
  Button,
  Message
} from 'semantic-ui-react'

// import { addCommunity, isMyCommunity } from '../integration_funcs.js'
// import CommunityService from '../CommunityService.js';
// import UserService from '../UserService.js';
import MakeCommunity from './MakeCommunity.js';
import {updateCommunity} from '../integration_funcs'





class AllCommunities extends React.Component {
  state = {
    makeMode: false,
    renderNumber: 3
  }

  componentDidUpdate() {
    console.log(this.state, this.props);
  }

  showMore = () => {
    console.log("Showing more");
    this.setState(prevState => ({
      renderNumber: (this.state.renderNumber + 3)
    }))
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
    const communities = this.props.allCommunities.slice(0, this.state.renderNumber).map((com, i) => {
      const included = this.props.myCommunities.includes(com) ;
      return (
        <Message
            as={Button}
            onClick = {this.handleAddClick({name: com.name, users: com.users.push(this.props.user)})}
            color={included ? 'teal' : 'grey'}
            fluid size='small'
            key = {i}>
          <Message.Header>{com.name}</Message.Header>
          <p>
          {included ? `You're in this community!` : 'Click to add!'}
          </p>
        </Message>
    )})

    const makeCommunityButton =
      <Button
        color='orange' fluid size='large'
        onClick = {this.MakeModeOn}>
        {'Create a new community!'}
      </ Button>;

    return (
      <div>
        {(this.state.makeMode === true) ?
          <MakeCommunity callback={this.toggleMakeMode} user={this.props.user}/>
          :
          <Container text align='center' style={{ marginTop: '7em', marginBottom: '1em' }}>
          {communities}
          {(this.state.renderNumber < this.props.allCommunities.length) ?
            <Button onClick = {this.showMore}>Show More Communities</Button> :
            <p>That's all the communities!</p>}
          <p> Don't see any you like? </p>
          {makeCommunityButton}
          </Container>
        }
      </div>
    )
  }

}


export default AllCommunities
