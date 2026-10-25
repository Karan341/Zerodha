import axios from "axios";

const configuredApiUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://zerodha-backend-2ozm.onrender.com"
    : "http://localhost:3002");

export const API_URL = configuredApiUrl.replace(/\/+$/, "");
export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://zerodha-frontend-snowy.vercel.app"
    : "http://localhost:3000");

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
