// Module to call REST API from Django back-end

import axios from 'axios';
// developement settings
const API_URL = 'http://localhost:8000/api/community/';
// production settings
//const API_URL = 'http://159.89.133.73/api/community/';

export default class CommunityService{

    //constructor(){}

    getAllCommunities() {
        const url = `${API_URL}`;
        return axios.get(url).then(response => response.data);
    }
    // getCommunitiesByName(name){
    //     const url = `${API_URL}${name}`;
    //     return axios.get(url).then(response => response.data);
    // }
    getCommunity(name) {
        const url = `${API_URL}${name}`;
        return axios.get(url).then(response => response.data);
    }
    deleteCommunity(community){
        const url = `${API_URL}${community.name}`;
        return axios.delete(url);
    }
    createCommunity(community){
        const url = `${API_URL}`;
        return axios.post(url,community);
    }
    updateCommunity(community){
        const url = `${API_URL}${community.name}`;
        return axios.put(url,community);
    }
}
