import React from 'react'
import {
  Container,
  Message,
  Segment,
  Button
} from 'semantic-ui-react'


class Reminders extends React.Component {
  state = {
    myReminders: [],
    renderNumber: 3
  }

  componentDidMount() {
    if (this.props.profile.reminderList) {
      this.setState({myReminders: this.props.profile.reminderList})
    } else {
      console.log("No reminder list field in user " + this.props.profile.username)
    }
  }

  showMore() {
    this.setState({
      renderNumber: (this.state.renderNumber + 3)
    })
  }

  render() {
    const myReminders = this.state.myReminders;
    const renderNumber = this.state.renderNumber;
    // const printing = (this.showMore(myReminders)).map((r, i)
    return(
      <div>
      <Container>
        <Segment placeholder>
            <h1>Reminders!</h1>
            {myReminders.slice(0, renderNumber).map((r, i) => {
              return(
                <Message key = {i} color = 'purple'>
                  <p>{r}</p>
               </Message>
             )})}
             {(renderNumber <= myReminders.length) ?
               <Button onClick = {this.showMore()}>Show Older Reminders</Button> :
               <p>That's all the reminders you've gotten! Keep recording observations to get some more :)</p>
             }
          </Segment>
        </Container>
      </div>
    )
  }
}




export default Reminders;
