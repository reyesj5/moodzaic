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
    replyMode: -1,
    comments: []
  }

  async componentDidMount() {
    await getPosts(this.props.myCommunity.name)
      .then(posts => {
        this.setState({ allPosts:  posts });
        posts.map((post) => {
        getPostComments(post.id).then(comments => {
          if (comments != []) {
            let newComments = this.state.comments.concat(comments)
            this.setState({ comments: newComments })
          }
        })})})
      }

  toggleReplyMode = (i) => {
    this.setState({
      replyMode: i
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async () => {
    await createPost({
      postid: this.state.allPosts.length + 1,
      poster: this.props.user,
      community: this.props.myCommunity,
      post: this.state.message
    }).then(response => {
      this.refreshPosts();
    })
  }

  refreshPosts = async () => {
    await getPosts(this.props.myCommunity.name)
    .then(posts => {
      this.setState({ allPosts:  posts });
      posts.map((post) => {
        getPostComments(post.id).then(comments => {
          if (comments != []) {
            let newComments = this.state.comments.concat(comments)
            this.setState({ comments: newComments });
            this.setState({ message: '' });
          }
        })
      })
    })
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
      this.setState({comments: []})
      this.refreshPosts();
      this.toggleReplyMode(-1);
    });

  }

  render() {
    const { message, replyMode } = this.state
    const community = this.props.myCommunity;
    // const username = this.props.user.username;
    const posts = this.state.allPosts;
    const comments = this.state.comments;

    console.log("comment start")
    console.log(comments)
    console.log("comment end")

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

    const printPosts = (posts) => posts.map((post, i) => {
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
            <Comment.Group>
              {printComments(comments.filter((comment) => {return comment.originalPostId === post.id}))}
            </Comment.Group>
        </Comment>
      )
    })

    const printComments = (comments) => comments.map((comment, i) => {
      return (
        <Comment key = {i} >
          <Comment.Avatar src={logo} />
          <Comment.Content>
            <Comment.Author as='a'>{comment.poster.username}</Comment.Author>
            <Comment.Metadata>
              <div>{comment.time}</div>
            </Comment.Metadata>
            <Comment.Text>{comment.post}</Comment.Text>
          </Comment.Content>
        </Comment>
      )
    })

    // {<Comment.Group>
    //   {getPostComments(post.id).then(comments => {console.log(comments);printPosts(comments)})}
    // </Comment.Group>/}
    // const printPosts = posts.map((post, i) => {
    //   console.log("checking posts")
    //   console.log(post)
    // {printPosts(getPostComments(post.id))}

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
    //         {printPosts(comments.filter((comment) => {return comment.originalPostId === 1}))))}
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
