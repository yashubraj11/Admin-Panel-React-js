// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
