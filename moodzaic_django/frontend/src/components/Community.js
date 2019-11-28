import React from 'react'
import logo from '../logo.png';
import {
  Header,
  Form,
  Comment,
  Button
} from 'semantic-ui-react'
// import PostService from '../PostService.js';
import { getPosts, createPost, createComment, getPostComments } from '../integration_funcs.js'


class Community extends React.Component {
  state = {
    message: '',

    // now: '',
    allPosts: [],
    myPosts: [],
    replyMode: -1
  }

  async componentDidMount() {
    await getPosts()
      .then(posts => this.setState({ allPosts:  posts }))
      .then(
        this.setState(prevState => ({
          myPosts: (this.state.allPosts).filter((post) => {
            return(
              post.community === this.props.myCommunity
            )
          }).map(p => ({comments: getPostComments(p.id), ...p}))
        })))
        .then(
          console.log(this.state)
        )
      }

  toggleReplyMode = (i) => {
    console.log(this.state.replyMode)
    this.setState({
      replyMode: i
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    createPost({ 
      postid: this.state.allPosts.length + 1,
      poster: this.props.user,
      community: this.props.myCommunity,
      post: this.state.message
    });
    this.setState({ message: '' });
  }

  handleReply = (op) => {
    console.log(op);
    op.postid = op.id;
    createComment({
      postid: this.state.allPosts.length + 1,
      poster: this.props.user,
      community: this.props.myCommunity,
      post: this.state.message,
      originalPost: op
    }).then(response => {
      this.setState({ message: '' });
    });
    
  }

  render() {
    const { message, replyMode } = this.state
    const community = this.props.myCommunity;
    // const username = this.props.user.username;
    const posts = this.state.allPosts;

    const reply_box = (post) => {
      return(
        <Form onSubmit={this.handleReply.bind(this, post)}>
          <Form.TextArea
            placeholder='Reply to this comment'
            name='message'
            value={message}
            onChange={this.handleChange}
          />
          <Button.Group>
          <Form.Button
            size='mini'
            compact
            content='reply'
            labelPosition='left'
            type='submit'
            icon='edit' primary
          />
          <Form.Button
            size='mini'
            compact
            content='cancel'
            labelPosition='left'
            onClick={this.toggleReplyMode.bind(this, -1)}
            icon='edit' primary
          />
          </Button.Group>
        </Form>
      )
    }

    const printPosts = (posts) =>  posts.map((post, i) => {
      return (
        <Comment key = {i} >
          <Comment.Avatar src={logo} />
          <Comment.Content>
            <Comment.Author as='a'>{post.poster.username}</Comment.Author>
            <Comment.Metadata>
              <div>{post.time}</div>
            </Comment.Metadata>
            <Comment.Text>{post.post}</Comment.Text>
            <Comment.Actions>
              <Comment.Action onClick={this.toggleReplyMode.bind(this, i)}>Reply</Comment.Action>
              {this.state.replyMode == i ? reply_box(post) : ''}
            </Comment.Actions>
          </Comment.Content>
          {/* <Comment.Group>
              {console.log(posts)}
              {printPosts(post.comments)}
          </Comment.Group> */}
        </Comment>
      )
    })
    // const printPosts = posts.map((post, i) => {
    //   console.log("checking posts")
    //   console.log(post)
    //   console.log("checking posts")
    //
    //   return (
    //     <Comment key = {i} >
    //       <Comment.Avatar src={logo} />
    //       <Comment.Content>
    //         <Comment.Author as='a'>{post.poster.name}</Comment.Author>
    //         <Comment.Metadata>
    //           <div>{post.time}</div>
    //         </Comment.Metadata>
    //         <Comment.Text>{post.message}</Comment.Text>
    //         <Comment.Actions>
    //           <Comment.Action onClick={this.toggleReplyMode}>Reply</Comment.Action>
    //           {this.replyMode ? reply_box : ''}
    //         </Comment.Actions>
    //       </Comment.Content>
    //       {post.comment_list.empty ? '' :
    //       <Comment.Group>
    //         {printPosts(posts.filter((p) => p.originalPost === post))}
    //       </Comment.Group>
    //       }
    //     </Comment>
    //   )
    // })

    return (
      <div>
        <Comment.Group>
          <Header as='h3' dividing>
            {community.name}
          </Header>

          {printPosts(posts)}

          <Form onSubmit={this.handleSubmit}>
            {this.replyMode ?
              <Form.TextArea
                placeholder='Say something to the community!'
                disabled
              /> :
              <Form.TextArea
                placeholder='Say something to the community!'
                name='message'
                value={replyMode == -1? message : ''}
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
