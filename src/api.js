import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

let cancelToken;

export const searchRecipes = async (query) => {
  if (cancelToken) {
    cancelToken.cancel("Operation canceled due to new request.");
  }
  cancelToken = axios.CancelToken.source();

  try {
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: query,
        number: 10
      },
      cancelToken: cancelToken.token
    });
    return response.data.results;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } else {
      console.error('Error fetching recipes:', error);
    }
    return [];
  }
};

export async function getRecipeDetails(id) {
    const response = await fetch(
        `${BASE_URL}/${id}/information?apiKey=${API_KEY}`
    );
    return await response.json();
}