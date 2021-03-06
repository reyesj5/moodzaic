import  React, { Component } from  'react';

import  UserService  from  '../UserService';

const  userService  =  new  UserService();

class  UsersList  extends  Component {
  constructor(props) {
        super(props);
        this.state  = {
            users: [],
            nextPageURL:  ''
        };
        this.nextPage  =  this.nextPage.bind(this);
        this.handleDelete  =  this.handleDelete.bind(this);
    }
    componentDidMount() {
      var  self  =  this;
      userService.getUsers().then(function (result) {
          self.setState({ users:  result.data, nextPageURL:  result.nextlink})
      });
    }
    handleDelete(e,pk){
      var  self  =  this;
      userService.deleteUser({pk :  pk}).then(()=>{
          var  newArr  =  self.state.users.filter(function(obj) {
              return  obj.pk  !==  pk;
          });
          self.setState({users:  newArr})
      });
    }
    nextPage(){
      var  self  =  this;
      userService.getUsersByURL(this.state.nextPageURL).then((result) => {
          self.setState({ users:  result.data, nextPageURL:  result.nextlink})
      });
    }
    render() {
      return (
        <div  className="user--list">
            <table  className="table">
                <thead  key="thead">
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.users.map( c  =>
                    <tr  key={c.pk}>
                        <td>{c.pk}  </td>
                        <td>{c.first_name}</td>
                        <td>{c.last_name}</td>
                        <td>{c.email}</td>
                        <td>{c.age}</td>
                        <td>{c.gender}</td>
                        <td>
                        <button  onClick={(e)=>  this.handleDelete(e,c.pk) }> Delete</button>
                        <a  href={"/user/" + c.pk}> Update</a>
                        </td>
                    </tr>)}
                </tbody>
            </table>
            <button  className="btn btn-primary"  onClick=  {  this.nextPage  }>Next</button>
        </div>
        );
    }
}
export  default  UsersList;
