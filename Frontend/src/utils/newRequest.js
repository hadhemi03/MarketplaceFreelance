import axios from "axios";

const newRequest = axios.create({
    baseURL: "http://localhost:5000/api",  // Correct URL of your backend
    headers: { "Content-Type": "application/json" },
});

export default newRequest;
