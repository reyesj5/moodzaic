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

  render() {
    console.log("im out here in mycommunities and these are the props", this.props)
    const myCommunities = this.props.myCommunities;
    // const communities =


    return (
      <div>
        <Container text align='center' style={{ marginTop: '7em' }}>
          {myCommunities.length === 0 ?
            <div>
            <p> You're not in any communities yet :( </p>
            <p> take a look at all the communities and choose one to join! </p>
            </div>
            :
            <div>
            {myCommunities.map((com, i) => {
              return (
                <Message
                    as={Button}
                    onClick = {this.props.communityCallback(com.name)}
                    color='teal'
                    fluid size='small'
                    key = {i}>
                  <Message.Header>
                    {com.name}
                  </Message.Header>
                </Message>
              )
            })}
            </div>
          }
        </Container>
      </div>
    )
  }
}

export default CommunitiesPage
