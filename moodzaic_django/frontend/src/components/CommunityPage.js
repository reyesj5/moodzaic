import React from 'react'
import {
  Container,
  Button,
} from 'semantic-ui-react'
import Community from './Community.js'
import CommunitiesPage from './MyCommunities.js'
import AllCommunities from './AllCommunities.js'
// import { getMyCommunityList, getAllCommunities } from '../integration_funcs.js'
// import CommunityService from '../CommunityService.js';
import {getAllCommunities, getUserByUsername} from '../integration_funcs'




class CommunityPage extends React.Component {
  state = {
        Community: '',
        AddMode: false,
        MyCommunityList: [],
        CommunityList: []
        // should these be props?
  }

  // componentDidMount() {
  //   fetch('')
  //     .then(response => response.json())
  //     .then(data => this.setState({ MyCommunityList : data }));
  // }

  async componentDidMount() {
    // var  self  =  this;
    const communities = await getAllCommunities();
    this.setState({ CommunityList: communities});
    // console.log('users pk:', this.props.user.pk);
    this.setState(prevState => ({
      MyCommunityList: (this.state.CommunityList).filter((community) => {
        const yes = (community.users).includes(this.props.user);
        console.log('should this community be mine?', yes);
        return yes;
      })
    }))
    console.log('communitypage props', this.props);
  }

  componentDidUpdate() {
    console.log(this.state);
  }


  toggleAddMode = () => {
    this.setState(prevState => ({
      AddMode: !prevState.AddMode
    }))
  }

  OpenCommunity = (acommunity) => {
    this.setState(prevState => ({
      Community: acommunity
    }))
  }

  render() {
    const addMode = this.state.AddMode;
    const community = this.state.Community;
    const myCommunityList = this.state.MyCommunityList;
    const communityList = this.state.CommunityList;
    const user = this.props.user;
    let myPage, myButton;

    if (community !== '') {
      myPage = <Community myCommunity = {community} username = {user} />;
      myButton =
      <Button color='teal' fluid size='large' onClick = {this.OpenCommunity('')}>
        See My Communities
      </Button>;
    }

    else if (addMode === false) {
      myPage = <CommunitiesPage communityCallback = {this.OpenCommunity} myCommunities = {myCommunityList}/>;
      myButton =
      <Button color='teal' fluid size='large' onClick = {this.toggleAddMode}>
        See All Communities
      </Button>;
    }

    else {
      myPage = <AllCommunities allCommunities = {communityList} myCommunities = {myCommunityList} user={user}/>;
      myButton =
      <Button color='teal' fluid size='large' onClick = {this.toggleAddMode}>
        See My Communities
      </Button>;
    }


    return (
      <div>
        <Container text style={{ marginTop: '7em' }}>
          {myPage}
          {myButton}
        </Container>
      </div>
    )
  }
}




export default CommunityPage;
