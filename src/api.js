const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function searchRecipes(query) {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      query: query,
      number: '10',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      instructionsRequired: 'true',
      titleMatch: query,
      sort: 'popularity',
      sortDirection: 'desc'
    });

    console.log('Fetching from URL:', `${BASE_URL}/complexSearch?${params}`)
    const response = await fetch(`${BASE_URL}/complexSearch?${params}`);
    const data = await response.json();
    console.log('API response:', data)
    return data.results;
}

export async function getRecipeDetails(id) {
    const response = await fetch(
        `${BASE_URL}/${id}/information?apiKey=${API_KEY}`
    );
    return await response.json();
}