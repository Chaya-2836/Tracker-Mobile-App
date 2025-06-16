import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default async function fetchUser() {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}