import React from 'react'
import {
  Container,
  Message,
  Segment,
  Button
} from 'semantic-ui-react'
import { updateProfile } from '../integration_funcs'


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
      this.setState({myReminders:
        ["You are not alone.",
        "There is nothing wrong with getting help.",
        "There is also nothing wrong with pushing others away.",
        "You don\u2019t have to do things others do or people tell you to do.",
        "Never blame yourself for the people who seem to have left you behind.",
        "In life, you can not win every battle, but you can definitely win the war.",
        "You are in control.", "You still need the rest.",
        "You can pray, someone will listen.", "Loving is amazing.",
        "But never ever ever forget to love yourself as well."]})
    }
  }

  componentDidUpdate() {
    //console.log("Updated. New render number: ", this.state.renderNumber)
  }


  showMore = () => {
    console.log("Showing more");
    this.setState(prevState => ({
      renderNumber: (this.state.renderNumber + 3)
    }))
  }

  removeReminder = (index) => {
    let reminders = this.props.profile.reminderList;
    reminders.splice(index, 1);
    updateProfile(this.props.profile.username, {reminderList: reminders});
  }


  render() {
    const myReminders = this.state.myReminders;
    const renderNumber = this.state.renderNumber;
    //console.log('rendernumber', renderNumber);
    console.log(myReminders.slice(0, renderNumber));
    return(
      <div>
      <Container>
        <Segment placeholder>
            <h1>Reminders!</h1>
            {myReminders.slice(0, renderNumber).map((r, i) => {
              return(
                <Message key = {i} color = 'purple' onClick={() => this.removeReminder(i)}>
                  <p>{r}</p>
               </Message>
             )})}
             {(renderNumber <= myReminders.length) ?
               <Button onClick = {this.showMore}>Show Older Reminders</Button> :
               <p>That's all the reminders you've gotten! Keep recording observations to get some more :)</p>
             }
          </Segment>
        </Container>
      </div>
    )
  }
}




export default Reminders;
