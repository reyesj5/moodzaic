import React from 'react'
import {
  Container,
  Button,
  Message
} from 'semantic-ui-react'


// const CommunitiesPage = ({myCommunities}) => (
//   <div>
//     <MyMenu />
//     <Container text style={{ marginTop: '7em' }}>
//     <p> should show all the communities and allow you to select one to look at,
//     and then pass that info for the specific community page</p>
//     </Container>
//     <Footer />
//   </div>
// )

class CommunitiesPage extends React.Component {
  state = {
    openCommunity: false
  }

  // openCommunity(c) {
  //   return <Community communityName = {c} />
  // }
  openCommunity = (c) => {
         this.props.communityCallback(c);
    }

  render() {
    const myCommunities = this.props.myCommunities;
    const communities = myCommunities.map((com, i) => {
      return <Message
          as={Button}
          onClick = {this.openCommunity(com)}
          color='teal'
          fluid size='small'
          key = {i}>
        <Message.Header>{com.name}</Message.Header>
      </Message>
    })


    return (
      <div>
        <Container text align='center' style={{ marginTop: '7em' }}>
          {myCommunities.length === 0 ?
            <div>
            <p> You're not in any communities yet :( </p>
            <p> take a look at all the communities and choose one to join! </p>
            </div>
            :
            {communities}
          }
        </Container>
      </div>
    )
  }
}

export default CommunitiesPage
