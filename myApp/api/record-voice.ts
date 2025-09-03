import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:3008/api/",
});

export default API;
