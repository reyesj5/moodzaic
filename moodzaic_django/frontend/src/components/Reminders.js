import React from 'react'
import {
  Container,
  Message,
  Segment,
  Button
} from 'semantic-ui-react'
import { updateProfile } from '../integration_funcs'
import { getMoods } from './MoodInput'


class Reminders extends React.Component {
  state = {
    myEmotion: "",
    myReminders: [],
    renderNumber: 3
  }

  componentDidMount() {
    console.log(this.props.profile.username)
    console.log(this.props.profile)
    console.log(this.props.profile.reminderList)
    console.log(this.props.profile.MoodScore)
    if (this.props.profile.reminderList || this.props.profile.reminderList === "") {
      this.setState({myReminders: this.props.profile.reminderList.split(";").filter(d => d != "")})
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
    if (this.props.profile.MoodScore >= 0 && this.props.profile.MoodScore <= 41){
      this.setState({myEmotion: getMoods()[this.props.profile.MoodScore]})
    }else{
     this.setState({myEmotion: "No Predicted Mood Yet"})
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

  removeReminder = async (r) => {
    console.log(r);
    await updateProfile(this.props.profile.username, {reminderList: r}).then(response => {
      console.log(response.data)
      this.props.updateProfile(response.data);
      this.setState({myReminders: response.data.reminderList.split(";").filter(d => d != "")})
    } );
  }

  render() {
    const myReminders = this.state.myReminders;
    console.log(myReminders);
    const renderNumber = this.state.renderNumber;
    const myEmotion = this.state.myEmotion;
    console.log('rendernumber', renderNumber);

    return(
      <div>
      <Container>
        <Segment placeholder>
            <h1>Reminders!</h1>
            <h4>Predicted Mood for Today: {myEmotion}</h4>
            {myReminders.slice(0, renderNumber).map((r, i) => {
              return(
                <Message key = {i} color = 'purple' onClick={() => this.removeReminder(r)}>
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
