import React from 'react'

import {
  Container,
  Header,
  Form,
  Button,
  Dropdown,
  Message
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';

import {
  BrowserRouter as Router,
  // Switch,
  // Route,
  Link
} from "react-router-dom";
import {createObservation, getLastPostDate, updateObservation} from "../integration_funcs"


const getDailyQuestions = () => {
  const questions = {
    sleep: "Hours of sleep",
    exercise: "Hours of exercise",
    meals: "Meals/day",
    work: "Hours of work"
  }
  return questions;
}

const getMoods = () => {

  const moods = [
    "Fear",
    "Anger",
    "Surprise",
    "Disgust",
    "Sad",
    "Happy",
    "Hurt",
    "Threatened",
    "Hateful",
    "Mad",
    "Aggressive",
    "Frustrated",
    "Distant",
    "Critical",
    "Disapproval",
    "Awful",
    "Avoidance",
    "Guilty",
    "Abandoned",
    "Despair",
    "Depressed",
    "Lonely",
    "Bored",
    "Optimistic",
    "Intimate",
    "Peaceful",
    "Powerful",
    "Accepted",
    "Proud",
    "Interested",
    "Joyful",
    "Excited",
    "Amazed",
    "Confused",
    "Startled",
    "Scared",
    "Anxious",
    "Insecure",
    "Submissive",
    "Rejected",
    "Humiliated",
    "Tired",
  ]
  return moods;
}

//exports getMoods() to access array
export { getMoods }

class MoodPage extends React.Component {
  state = {
    QuestionObj: getDailyQuestions(),
    MoodList: getMoods(),
    errors: [],
    validation: ""
  }

  handleChange = (name, e) => {
    this.setState(
      { [name]: parseInt(e.target.value) },
      () => console.log(this.state)
    )
  }

  handleMood = (e, {value}) => {
    console.log(value)
    this.setState(
      { mood: value },
      () => console.log(this.state)
    )
  }

  validate = (observation) => {
    const errors = [];
    if (typeof(observation.sleep) === 'undefined' || !(0 <= observation.sleep)|| !(24 >= observation.sleep)) {
     errors.push("Please enter a value between 0 and 24 for hours of sleep");
   }
   if (typeof(observation.exercise) === 'undefined' || !(0 <= parseInt (observation.exercise))|| !(24 >= observation.exercise)) {
     errors.push("Please enter a value between 0 and 24 for hours of exercise");
   }
   if (typeof(observation.meals) === 'undefined' || !(0 <= observation.meals)) {
     errors.push("Please enter a positive value for number of meals");
   }
   if (typeof(observation.work) === 'undefined' || !(0 <= observation.work)|| !(24 >= observation.work)) {
     errors.push("Please enter a value between 0 and 24 for hours of work");
   }
   if (typeof(observation.mood) === 'undefined') {
     errors.push("Please enter a value for mood");
   }
   if ((observation.sleep + observation.work + observation.exercise) > 24) {
     console.log("Greater than 24")
     errors.push("Total hours of sleep, work, and exercise cannot be greater than 24");
   }
   return errors;
  }

  handleClick = async () => {
    var observation = {
      sleep: this.state.sleep,
      exercise: this.state.exercise,
      meals: this.state.meals,
      work: this.state.work,
      mood: this.state.MoodList.indexOf(this.state.mood)
    }
    const errors = this.validate(observation);
    this.setState({ errors });
    if (errors.length > 0) {
      return;
    }
    this.setState({validation: "Sending mood"})
    await getLastPostDate(this.props.profile.username).then(async lastDate => {
      let today = new Date();
      let dd = today.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = today.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yyyy = today.getFullYear();
      let date = `${yyyy}-${mm}-${dd}`;
      if (lastDate != date) {
        await createObservation(this.props.profile.username, observation)
        .then(response => {
          console.log("Finished sending observation");
          this.setState({validation: "Mood submitted! Come back again tomorrow"});
          this.props.fetchProfile();
        }).catch(error => console.log(error));
      } else {
        await updateObservation(this.props.profile.username, observation, date)
        .then(response => {
          console.log("Finished updating observation");
          this.setState({validation: "Mood for today updated!"});
          this.props.fetchProfile();
        }).catch(error => console.log(error));
      }
    }).catch(error => console.log(error));

  }

  render() {
    const {QuestionObj} = this.state;
    const {MoodList} = this.state;
    const { errors } = this.state;
    const { validation } = this.state;
    return(
      <div>
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1'>How are you feeling?</Header>
          <p>Some ~important~ questions for you about your mood today.</p>
          <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
          <div>{validation !== "" ? <Message color="green">{validation}</Message> : <p></p>}</div>
          <Form>
            {Object.entries(QuestionObj).map((Question, index) => {
              return (
                <Form.Field key={index} onChange={(e)=>this.handleChange(Question[0], e)}>
                  <label>{Question[1]}</label>
                  <input type="number"/>
                </Form.Field>)})}
            <Form.Field>
                <label>Mood</label>
                <Dropdown onChange={this.handleMood.bind(this)}
                placeholder='Select' fluid search selection
                  options={MoodList.map((Mood, index) =>
                    {return({value: Mood, text: Mood})})
                  } />
            </Form.Field>
          </Form>
          <br />
          <Router>
          <Link to="/Profile">
            <Button onClick={this.handleClick} color='teal' fluid size='large'>
              Submit
            </Button>
          </Link>
          </Router>
        </Container>
      </div>
    )
  }
}

// {MoodList.map((Mood, index) => {
// return(<Dropdown placeholder='Select'
//   fluid selection options={[
//     {value:{Mood} ,text:"grumpy"},
//     {value:"big mood", text:"big mood"},
//     {value:"nibblish", text:"nibblish"}]} />)
//   })
// }

export default MoodPage;
