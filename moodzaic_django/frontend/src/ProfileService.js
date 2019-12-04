// Module to call REST API from Django back-end
// for users, unique personal key (pk) is username

import axios from 'axios';
// developement settings
const API_URL = 'http://localhost:8000/api/profile/';
// production settings
//const API_URL = 'http://159.89.133.73/api/profile/';

export default class ProfileService{

    //constructor(){}

    getProfiles() {
        const url = `${API_URL}`;
        return axios.get(url).then(response => response.data);
    }
    // getUsersByURL(link){
    //     const url = `${API_URL}${link}`;
    //     return axios.get(url).then(response => response.data);
    // }
    getProfile(username) {
        const url = `${API_URL}${username}`;
        return axios.get(url).then(response => response.data);
    }
    deleteProfile(username){
        const url = `${API_URL}${username}`; //should be username instead of pk, since that is the identifier?
        return axios.delete(url);
    }
    createProfile(username){
        const url = `${API_URL}`;
        return axios.post(url,username);
    }
    updateProfile(username){
        const url = `${API_URL}${username}`;
        return axios.put(url,username);
    }
}
