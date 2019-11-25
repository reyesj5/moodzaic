import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

  function getUsers() {
    return axios.get(`${API_URL}users`).then(response => response.data).catch(error => console.log(error));
  }

  export function createUser(u){
    console.log(u);
    return axios.post(`${API_URL}users`, u)
      .then(response => {
        console.log(response);
        console.log(response.data);
      })
      .catch(error => console.log(error))
  }

  export function getUserByUsername(u) {
    console.log(u)
    //get all of a user's info by putting in their username
    return axios.get(`${API_URL}users/${u}`).then(response => {
      console.log(response);
      console.log(response.data);
      return response.data;
    })
    .catch(error => console.log(error))
  }

  export function updateUser(u){
    return axios.put(`${API_URL}users/${u.username}`, u);
  }



  export function getAllCommunities() {
      const url = `${API_URL}all/community`;
      return axios.get(url).then(response => response.data);
  }

  export function getCommunity(name) {
      const url = `${API_URL}community/${name}`;
      return axios.get(url).then(response => response.data);
  }
  // export function deleteCommunity(community){
  //     const url = `${API_URL}$/community/{community.name}`;
  //     return axios.delete(url);
  // }
  // export function createCommunity(community){
  //     const url = `${API_URL}community/`;
  //     return axios.post(url,community);
  // }

  export function createCommunity(community){
      return axios.post(`${API_URL}create/community`, {
        name: community.name,
        users: community.users
      })
        .then(response => {
          console.log(response);
          console.log(response.data);
        })
        .catch(error => console.log(error))
    }

  export function updateCommunity(community){
      const url = `${API_URL}community/${community.name}`;
      return axios.put(url,community);
  }

  export function usersCommunities(username){
      const url = `${API_URL}${username}/communities`;
      return axios.get(url).then(response => response.data);
  }



  export function getPosts() {
      const url = `${API_URL}posts`;
      return axios.get(url).then(response => response.data);
  }
  export function getPost(id) {
      const url = `${API_URL}posts/${id}`;
      return axios.get(url).then(response => response.data);
  }
  // export function deletePost(post){
  //     const url = `${API_URL}${post.id}`;
  //     return axios.delete(url);
  // }
  export function createPost(post){
      const url = `${API_URL}create/posts`;
      return axios.post(url,post);
  }

  export function createComment(comment){
    const url = `${API_URL}create/comment`;
    return axios.post(url,comment);
  }
  // export function updatePost(post){
  //     const url = `${API_URL}${post.id}`;
  //     return axios.put(url, post);
  // }


  // export function getProfiles() {
  //     const url = `${API_URL}profiles`;
  //     return axios.get(url).then(response => response.data);
  // }
  // export function getProfile(username) {
  //     const url = `${API_URL}${username}profiles/`;
  //     return axios.get(url).then(response => response.data);
  // }
  // export function deleteProfile(username){
  //     const url = `${API_URL}profiles/${username}`; //should be username instead of pk, since that is the identifier?
  //     return axios.delete(url);
  // }
  // export function createProfile(username){
  //     console.log(username);
  //     const url = `${API_URL}profiles/`;
  //     return axios.post(url,username);
  // }
  // export function updateProfile(username){
  //     const url = `${API_URL}profiles/${username}`;
  //     return axios.put(url,username);
  // }

  export function getProfiles() {
      const url = `${API_URL}profiles`;
      return axios.get(url).then(response => response.data);
  }
  export function getProfile(username) {
      const url = `${API_URL}profiles/${username}`;
      return axios.get(url).then(response => response.data);
  }
  // export function deleteProfile(username){
  //     const url = `${API_URL}profiles/${username}`; //should be username instead of pk, since that is the identifier?
  //     return axios.delete(url);
  // }
  // create not implemented yet
  export function createProfile(profile){
      console.log(profile);
      const url = `${API_URL}profiles`;
      return axios.post(url,profile);
  }
  export function updateProfile(username, profile){
      const url = `${API_URL}profiles/${username}`;
      return axios.put(url,profile);
  }

  export function createObservation(username, observation) {
    const url = `${API_URL}observations/${username}`;
    return axios.post(url, observation);
  }

  export function getUserObservations(username) {
    return axios.get(`${API_URL}observations/${username}`).then(response => response.data).catch(error => console.log(error));
  }
