import React from 'react'
import {
  Container,
  Button,
  Loader
} from 'semantic-ui-react'
import Community from './Community.js'
import CommunitiesPage from './MyCommunities.js'
import AllCommunities from './AllCommunities.js'
// import { getMyCommunityList, getAllCommunities } from '../integration_funcs.js'
// import CommunityService from '../CommunityService.js';
import {getAllCommunities, usersCommunities} from '../integration_funcs'




class CommunityPage extends React.Component {
  state = {
        Community: '',
        AddMode: false,
        MyCommunityList: [],
        // CommunityList: [],
        loadingAll: false,
        loadingMine: false,
        vision: false
  }

  loadingTrue = () => {
    this.setState(prevState => ({
      loading: true
    }))
  }
  loadingFalse = () => {
    this.setState(prevState => ({
      loading: false
    }))
  }

  async componentDidMount() {
    // let loadAll = false;
    // let loadMine = false;
    this.setState({ loadingMine: true });

    let mine = await usersCommunities(this.props.user.username);
    this.setState({ MyCommunityList: mine });
      // .then(mine => this.setState({ MyCommunityList: mine }))
      // .then(mine => this.setState( {loadingMine: false} ))
    this.setState( {loadingMine: false} );


    console.log('communitypage props', this.props);
    console.log('communitypage state', this.state);

  }

  // componentDidUpdate() {
  //   // this.setState(prevState => ({
  //   //   loading: true
  //   // }))
  //   console.log(this.state);
  //   // this.setState(prevState => ({
  //   //   loading: false
  //   // }))
  // }


  AddModeOn = () => {
    this.setState(prevState => ({
      AddMode: true,
      vision: true
    }))
  }

  AddModeOff = () => {
    this.setState(prevState => ({
      AddMode: false,
      vision: true
    }))
  }
  // toggleAddMode = () => {
  //   this.setState(prevState => ({
  //     AddMode: !prevState.AddMode
  //   }))
  // }



  OpenCommunity = (acommunity) => {
    console.log(acommunity)
    this.setState(prevState => ({
      Community: acommunity
    }))
  }

  render() {
    const addMode = this.state.AddMode;
    const community = this.state.Community;
    const myCommunityList = this.state.MyCommunityList;
    // const communityList = this.state.CommunityList;
    const user = this.props.user;
    let myPage, myButton;
    console.log(this.state)

    if (this.state.loadingMine) {
      myPage =
      <div>
      <p>Reaching out to others is a necessary part of caring for the self.</p>
      </div>
      myButton = ''
    }

    // else if (community !== '') {
    //   myPage = <Community myCommunity = {community} username = {user} />;
    //   myButton =
    //   <Button color='teal' fluid size='large' onClick = {this.OpenCommunity('')}>
    //     See My Communities
    //   </Button>;
    // }

    else if (this.state.vision === false) {
      myPage = ''
      myButton = ''
    }

    else if (addMode === false) {
      myPage = <CommunitiesPage myCommunities = {myCommunityList}/>;

      // <CommunitiesPage communityCallback = {this.Community} myCommunities = {myCommunityList}/>;
      myButton = ''
    }

    else {
      myPage =
      <AllCommunities myCommunities = {myCommunityList} user={user}/>;
      myButton = ''
    }


    return (
      <div>
        <Container text style={{ marginTop: '7em' }}>
        <Button color='teal' fluid size='large' onClick = {this.AddModeOff}>
          See My Communities
        </Button>
        <Button color='teal' fluid size='large' onClick = {this.AddModeOn}>
          See All Communities
        </Button>
          {myPage}
        </Container>
      </div>
    )
  }
}






export default CommunityPage;
