import React from 'react'
import logo from '../logo.png';
import {
  Container,
  Grid,
  Header,
  Image,
  List,
  Segment,
} from 'semantic-ui-react'

const Footer = () => (
  <div>
    <Segment inverted vertical style={{ margin: '7em 0em 0em', padding: '4em 0em' }}>
      <Container textAlign='center'>
        <Grid divided inverted stackable>
          <Grid.Column width={3}>
            <Header inverted as='h4' content='Source' />
            <List link inverted>
              <List.Item as='a' target="_blank" href="https://github.com/reyesj5/moodzaic">
                Our Github
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as='h4' content='Group Members' />
            <List link inverted>
              <List.Item >Molly Fortnow</List.Item>
              <List.Item >Daniel Steinberg</List.Item>
              <List.Item as='a' target="_blank" href="https://www.jerseyfonseca.com/">Jersey Fonseca</List.Item>
              <List.Item >Emil Sohlberg</List.Item>
              <List.Item >Marco Anaya</List.Item>
              <List.Item >Zipporah Klain</List.Item>
              <List.Item >Hunter</List.Item>
              <List.Item >Chema ? I'll alphabatize this later</List.Item>
              <List.Item >note to group: can link your name to whatever you want (linkedin, portfolio, whatever)</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header inverted as='h4' content='Moodzaic' />
            <p>
              Moodzaic was created as a project for Software Construction at UChicago in Autumn 2019.
              We have been very tired; please excuse any bugs.
              Thank you.
            </p>
            <Image centered style={{ marginTop: '3em' }} size='mini' src={ logo } />
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  </div>
)

export default Footer
