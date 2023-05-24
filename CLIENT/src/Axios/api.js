import axios from "axios";

console.log(process.env.REACT_APP_BASE_URL,'unddddddddddddddddddiiiiiiiiiiiiiifi');

export const baseUrl = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
})