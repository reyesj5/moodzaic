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
import {getAllCommunities, updateCommunity} from '../integration_funcs'





class AllCommunities extends React.Component {
  state = {
    makeMode: false,
    renderNumber: 3,
    loadingAll: false,
    allCommunities: [],
    myCommunities: []
  }

  componentDidMount() {
    this.setState({ loadingAll: true });
    this.setState({ myCommunities: this.props.myCommunities });
    getAllCommunities()
      .then(communities => this.setState({ allCommunities: communities }))
      .then(mine => this.setState( {loadingAll: false} ))
  }

  componentDidUpdate() {
    console.log(this.state, this.props);

  }

  isUserInCommunity = (com) => {
    for (var i=0; i < this.props.myCommunities.length; i++) {
        if (this.props.myCommunities[i].name === com.name) {
            return true;
        }
    }
    return false;
  }

  showMore = () => {
    console.log("Showing more");
    this.setState(prevState => ({
      renderNumber: (this.state.renderNumber + 3)
    }))
  }

  async handleAddClick(community) {
    community.users.push(this.props.user)
    await updateCommunity(community).then(response =>
    {
      this.refreshCommunities()
    })
  }

  async refreshCommunities() {
    this.props.updateMyCommunity();
  }

  // setAllCommunitiesState() {
  //   getAllCommunities()
  //     .then(communities => this.setState({
  //       allCommunities: communities
  //     })
  //   )
  // }

  // toggleMakeMode = () => {
  //   this.setState(prevState => ({
  //     makeMode: !prevState.makeMode
  //   }))
  // }

  MakeModeOn = () => {
    this.setState(prevState => ({
      makeMode: true
    }))
  }

  async MakeModeOff() {
  let communities = await getAllCommunities()
  this.props.updateMyCommunity()
  this.setState(prevState => ({
      allCommunities: communities,
      // myCommunities: this.props.myCommunities,
      makeMode: false } ))
  }


  render() {
    const communities = this.state.allCommunities.slice(0, this.state.renderNumber).map((com, i) => {
      const included = this.isUserInCommunity(com);
      return (
        <Message
            as={Button}
            onClick = {this.handleAddClick.bind(this, com)}
            color={included ? 'teal' : 'grey'}
            fluid size='small'
            key = {i}>
          <Message.Header>{com.name}</Message.Header>
          <p>
          {included ? `You're in this community!` :'Click to add!'}
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
          <MakeCommunity callback={this.MakeModeOff.bind(this)} callbackback={this.props.updateMyCommunity} user={this.props.user}/>
          :
          <Container text align='center' style={{ marginTop: '1em', marginBottom: '1em' }}>
          {communities}
          {(this.state.renderNumber < this.state.allCommunities.length) ?
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
