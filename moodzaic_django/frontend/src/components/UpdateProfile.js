import React from 'react'
import {
  Container,
  Grid,
  Header,
  Form,
  // Dropdown,
  Button,
  Message
} from 'semantic-ui-react'
// import MyMenu from './Menu.js';
// import Footer from './Footer.js';
import {updateProfile, updateUser} from '../integration_funcs.js'

const getErrors = () => {
  const errors = [
    "Please Enter Valid Number of Hours between 0 and 24",
    "Goals cannot sum to over 24 hours",
    "Please Enter Valid Postive Integer"
  ]
  return errors;
}

class UpdateProfile extends React.Component {
  state = {
    user: {},
    profile: {},
    confirming: true,
    errors: []
  }


  goalChange = (goal_num, new_goal) => {
    console.log("Changing the goal list");
    console.log(this.props.profile)
    let goals = this.props.profile.goals;
    console.log(goals);
    var ArrGoals = goals.split(",");
    var i;
    var sum;
    var new_goals;
    if ( goal_num !== 3){
      const parsed = parseFloat(new_goal)
      if (isNaN(parsed)) { return 0 }
      if (new_goal < 0) { return 0 }
      if (new_goal > 24) { return 0 }
      sum = parsed;
      for (i = 0; i < ArrGoals.length; i++){
        if (i === 3) { continue; }
        if (i === goal_num) { continue; }
        if (ArrGoals[i] < 0 ) { continue; }
        sum += ArrGoals[i];
      }
      if (sum > 24) { return 1 }
      ArrGoals[goal_num] = parsed;
    }else{
      const parsed = parseInt(new_goal)
      if (isNaN(parsed)) { return 2 }
      if (parsed < 0) { return 2 }
      ArrGoals[goal_num] = parsed;
    }
    new_goals = ArrGoals.join(",");
    console.log(new_goals)
    return new_goals;
  }

  validate = (observation) => {
    const errors = [];
    if (!(typeof(observation.exercise) === 'undefined')&&  (!(0 <= observation.sleep)|| !(24 >= observation.sleep))) {
      errors.push("Please enter a value between 0 and 24 for hours of sleep");
    }
    if (!(typeof(observation.exercise) === 'undefined')&&  (!(0 <= parseInt (observation.exercise))|| !(24 >= observation.exercise))) {
      errors.push("Please enter a value between 0 and 24 for hours of exercise");
    }
    if (!(typeof(observation.meals) === 'undefined')&& (!(0 <= observation.meals))) {
      errors.push("Please enter a positive value for number of meals");
    }
    if (!(typeof(observation.work) === 'undefined')&& (!(0 <= observation.work)|| !(24 >= observation.work))) {
      errors.push("Please enter a value between 0 and 24 for hours of work");
    }

    if ((observation.sleep + observation.work + observation.exercise) > 24) {
      console.log("Greater than 24")
      errors.push("Total hours of sleep, work, and exercise cannot be greater than 24");
    }
    return errors;
  }


  handleChange = (e, object, attribute) => {
    console.log(object, attribute, e.target.value);
    let obj = this.state[object];
    obj[attribute] = e.target.value;
    this.setState(prevState => ({
        [object]: obj
      }), () => console.log(this.state));
  }

  handleChange2 = (e,object, name) => {
    this.handleChange(e, object, name);
    this.setState(
      { [name]: parseInt(e.target.value) },
      () => console.log(this.state)
    )
  }

  handlegoalChange = (e, object, attribute, num) => {
    const q = this.goalChange(num, e);
    this.handleChange(q, object, attribute);

  }

  handleSubmit = () => {
    this.setState(prevState => ({
      confirming: true
    }))
    var observation = {
      sleep: this.state.sleep_goal,
      exercise: this.state.exercise_goal,
      meals: this.state.meal_goal,
      work: this.state.work_goal,
    }
    const errors = this.validate(observation);
    console.log(errors)
    this.setState({ errors });
    if (errors.length > 0) {
      return;
    }

    let username = this.props.user.username;
    console.log(username);
    if(this.state.password === this.state.confirmp) {
      if (this.state.user !== {}) {
        updateUser(username, this.state.user).then(response => {
          console.log(response.data);
          this.props.updateUser(response.data);
        }).catch(error => {
          this.setState({confirming: false});
        })
      }
      if (this.state.profile !== {}) {
        updateProfile(username, this.state.profile).then(response => {
          console.log(response.data);
          this.props.updateProfile(response.data);
        }).catch(error => {
          this.setState({confirming: false});
        })
      }
      // this.props.callbackback(this.props.user.username);
      this.props.callback();
    }
    else {
      this.setState({confirming: false})
    }
  }
  // handleSubmit = (user, profile) => {
  //   updateUser(user);
  //   updateProfile(profile);
  // }

  render() {
    const user = this.props.user;
    const { errors } = this.state;
    //const profile = this.gettingProf;
    // const profile = this.props.profile;

    return(
      <div>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Container text style={{ marginTop: '-1' }}>
            <Header as='h1'>Editing {user.username}'s profile</Header>
            <p>Fill in anything about your profile you want to change!</p>
            <div>{errors.length > 0 ? <Message color="red">{errors[0]}</Message> : <p></p>}</div>
            <Form>
              <div className="two fields">
                <Form.Field name='first_name' onChange={(e) => this.handleChange(e, "user", "first_name")}>
                  <label>First Name</label>
                  <input />
                </Form.Field>
                <Form.Field name='last_name' onChange={(e) => this.handleChange(e, "user", "last_name")}>
                  <label>Last Name</label>
                  <input />
                </Form.Field>
              </div>
              <div className="three fields">
              <Form.Field name='age' onChange={(e) => this.handleChange(e, "profile", "age")}>
                <label>Age</label>
                <input type="number" placeholder='Age'/>
              </Form.Field>
              <Form.Field name='gender' onChange={(e) => this.handleChange(e, "profile", "gender")}>
                <label>Gender</label>
                <input />
              </Form.Field>
              <Form.Field name='email' onChange={(e) => this.handleChange(e, "user", "email")}>
                <label>Email</label>
                <input />
              </Form.Field>
              </div>
              <div className="two fields">
                <Form.Field name='password' onChange={(e) => this.handleChange(e, "user", "password")}>
                  <label>New Password</label>
                  <input type='password'/>
                </Form.Field>
                {this.state.confirming ?
                  <Form.Field name='password check' onChange={(e) => this.handleChange(e, "user", "confirmp")}>
                    <label>Confirm New Password</label>
                    <input type='password'/>
                  </Form.Field>
                :
                <Form.Field type='password' name='password check' onChange={(e) => this.handleChange(e, "user", "confirmp")}>
                  <label>Confirm New Password</label>
                  <input error/>
                </Form.Field>
              }
              </div>
              <div className="four fields">
              <Form.Field name='sleep' onChange={(e) => this.handleChange2(e , "profile", "sleep_goal")}>
                <label>Sleep Goal (Hours)</label>
                <input type='number'/>
              </Form.Field>
              <Form.Field name='exercise' onChange={(e) => this.handleChange2(e , "profile", "exercise_goal")}>
                <label>Exercise Goal (Hours)</label>
                <input type='number'/>
              </Form.Field>
              <Form.Field name='meals' onChange={(e) => this.handleChange2(e , "profile", "meal_goal")}>
                <label>Meal Goal (Number)</label>
                <input type='number'/>
              </Form.Field>
              <Form.Field name='work' onChange={(e) => this.handleChange2(e , "profile", "work_goal")}>
                <label>Work Goal (Hours)</label>
                <input type='number'/>
              </Form.Field>
              </div>
            </Form>
            <Button color='teal' fluid size='large' onClick={this.handleSubmit}>
              Update Account
            </Button>
          </Container>
        </Grid.Column>
      </Grid>
      </div>
    )

  }
}

export default UpdateProfile;
