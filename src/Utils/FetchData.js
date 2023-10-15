import axios, * as others from 'axios';

const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment'; // Replace with your API endpoint URL

export async function fetchData() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
}

