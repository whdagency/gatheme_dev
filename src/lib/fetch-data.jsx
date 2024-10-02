import { api } from "./api";

const fetchApiData = async (endpoint, defaultValue) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    return defaultValue;
  }
};

export default fetchApiData;
