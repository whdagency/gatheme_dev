import axios from "axios";
import { APIURL, APIURLS3 } from "./ApiKey";
export const STORAGE_URL = APIURLS3;

export const api = axios.create({
  baseURL: `${APIURL}/api`,
});
