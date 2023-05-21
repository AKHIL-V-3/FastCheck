import axios from 'axios'
import { baseUrl } from '../../Axios/api';

module.exports = {

    homeScreen: async () => {
        const { data } = await baseUrl.get("http://localhost:8000", {
            withCredentials: true
        }).catch((err) => {
            console.log(err);
            console.log(err.message);
        })
        return data
    },

    refreshToken: async () => {
        const { data } = await baseUrl.get("http://localhost:8000/refresh", {
            withCredentials: true

        }).catch((err) => {
            console.log(err);
        })
       
        return data
    },

     sendLogoutReq: async () => {
        const response = await baseUrl.post("http://localhost:8000/logout", null, {
            withCredentials: true
        })
        if (response.status === 200) return response
        return new Error("Unable to logout please try again")
    },



}