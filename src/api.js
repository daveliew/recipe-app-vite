import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

const api = axios.create({
  baseURL: BASE_URL,
  params: { apiKey: API_KEY }
});

export const searchRecipes = async (query) => {
  try {
    const response = await api.get('/complexSearch', {
      params: {
        query,
        number: 10,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    throw error;
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await api.get(`/${id}/information`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};