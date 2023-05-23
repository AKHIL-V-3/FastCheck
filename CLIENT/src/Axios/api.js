import axios from "axios";

export const baseUrl = axios.create({
    baseURL: "https://server.fastcheck.live"
})