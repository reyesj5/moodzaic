// Module to call REST API from Django back-end

import axios from 'axios';
// developement settings
const API_URL = 'http://localhost:8000/api/posts/';
// production settings
//const API_URL = 'http://159.89.133.73/api/posts/';

export default class PostService{

    //constructor(){}

    getPosts() {
        const url = `${API_URL}`;
        return axios.get(url).then(response => response.data);
    }
    // getCommunitiesByURL(link){
    //     const url = `${API_URL}${link}`;
    //     return axios.get(url).then(response => response.data);
    // }
    getPost(id) {
        const url = `${API_URL}${id}`;
        return axios.get(url).then(response => response.data);
    }
    deletePost(post){
        const url = `${API_URL}${post.id}`;
        return axios.delete(url);
    }
    createPost(post){
        const url = `${API_URL}`;
        return axios.post(url,post);
    }
    updatePost(post){
        const url = `${API_URL}${post.id}`;
        return axios.put(url, post);
    }
}
