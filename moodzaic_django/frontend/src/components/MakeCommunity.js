import React from 'react'
import {
  Container,
  Header,
  Form,
  Grid,
} from 'semantic-ui-react'
// import CommunityService from '../CommunityService.js';
import {createCommunity} from '../integration_funcs'





class MakeCommunity extends React.Component {
  state = {
    name: ''
  }

  handleChange = (e) => this.setState({ name: e.target.value });

  handleSubmit = () => {
      console.log('new name:', this.state.name);
      console.log('user from props', this.props.user);
      createCommunity({name: this.state.name, users: [this.props.user]});
      this.props.callback();
  }


  render() {
    return(
      <div>
      <Grid textAlign='center' style={{ height: '100vh' }}>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Container>
            <Header as='h1'>Creating A New Community</Header>
            <p>Your community needs a name to get started.
            After your community is created, anyone can join and post!
            </p>
            <Form>
                <Form.Field onChange={this.handleChange}>
                  <label>Name of Community</label>
                  <input />
                </Form.Field>
                <Form.Button color='teal' onClick={this.handleSubmit}>
                  Create Community
                </Form.Button>
            </Form>
          </Container>
        </Grid.Column>
      </Grid>
      </div>
    )
  }
}

export default MakeCommunity;
