import React from 'react'
import logo from '../logo.png';
import {
  Header,
  Form,
  Comment
} from 'semantic-ui-react'
// import PostService from '../PostService.js';
import { getPosts, createPost } from '../integration_funcs.js'


class Community extends React.Component {
  state = {
    message: '',
    // now: '',
    allPosts: [],
    myPosts: [],
    replyMode: false
  }

  componentDidMount() {
    getPosts().then(function (result) {
        this.setState({ allPosts:  result.data, nextPageURL:  result.nextlink})
    });
    this.setState(prevState => ({
      myPosts: (this.state.allPosts).filter((post) => {
        return(
          post.community === this.props.myCommunity
        )
      })
  }))}

  toggleReplyMode = () => {
    this.setState(prevState => ({
      replyMode: !prevState.replyMode
    }))
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    createPost({
      postid: this.state.posts.length + 1,
      poster: this.props.user,
      community: this.props.myCommunity,
      message: this.state.message
    });
    this.setState({ message: '' });
  }

  handleReply = (op) => {
    createPost({
      postid: this.state.posts.length + 1,
      poster: this.props.user,
      community: this.props.myCommunity,
      message: this.state.message,
      originalPost: op
    });
    this.setState({ message: '' });
  }

  // setTime = (time) => {
  //   this.setState({ now: time });
  // }

  render() {
    const { message } = this.state
    const community = this.props.myCommunity;
    // const username = this.props.username;
    const posts = this.state.myPosts;

    // var today = new Date();
    // var date = (today.getMonth()+1)+'-'+today.getDate()+'/'+today.getFullYear();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var now = date+' '+time;
    //
    // this.setTime(now);

    const reply_box = () => {
      return(
        <Form onSubmit={this.handleReply}>
          <Form.TextArea
            placeholder='Reply to this comment'
            name='message'
            value={message}
            onChange={this.handleChange}
          />
          <Form.Button
            content='reply'
            labelPosition='left'
            type='submit'
            icon='edit' primary
          />
          <Form.Button
            content='cancel'
            labelPosition='right'
            onClick={this.toggleReplyMode}
            icon='edit' primary
          />
        </Form>
      )
    }

    const printPosts = posts.map((post, i) => {
      return (
        <Comment key = {i} >
          <Comment.Avatar src={logo} />
          <Comment.Content>
            <Comment.Author as='a'>{post.poster.name}</Comment.Author>
            <Comment.Metadata>
              <div>{post.time}</div>
            </Comment.Metadata>
            <Comment.Text>{post.message}</Comment.Text>
            <Comment.Actions>
              <Comment.Action onClick={this.toggleReplyMode}>Reply</Comment.Action>
              {this.replyMode ? reply_box : ''}
            </Comment.Actions>
          </Comment.Content>
          {post.comment_list.empty ? '' :
          <Comment.Group>
            {printPosts(posts.filter((p) => p.originalPost === post))}
          </Comment.Group>
          }
        </Comment>
      )
    })

    return (
      <div>
        <Comment.Group>
          <Header as='h3' dividing>
            {community}
          </Header>

          {printPosts}

          <Form onSubmit={this.handleSubmit}>
            {this.replyMode ?
              <Form.TextArea
                placeholder='Say something to the community!'
                disabled
              /> :
              <Form.TextArea
                placeholder='Say something to the community!'
                name='message'
                value={message}
                onChange={this.handleChange}
              />
            }
            <Form.Button
              content='Post'
              labelPosition='left'
              type='submit'
              icon='edit' primary
            />
          </Form>
        </Comment.Group>
      </div>
    )
  }
}



export default Community
