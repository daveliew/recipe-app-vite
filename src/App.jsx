import { useState, useEffect, useRef, useCallback } from 'react';
import { searchRecipes, getRecipeDetails } from './api';
import RecipeDetails from './RecipeDetails';
import './App.css';

// Custom debounce function to avoid CSP issues
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Increase the delay here
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Increased to 1000ms (1 second)

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const debouncedFetchRecipes = useRef(
    debounce((term) => {
      console.log('Debounced fetch called with term:', term);
      if (!term) {
        setRecipes([]);
        return;
      }
      setLoading(true);
      searchRecipes(term)
        .then((data) => {
          console.log('Recipes fetched:', data);
          setRecipes(data.results || []);
          setQuotaExceeded(false);
          setError(null);
        })
        .catch(error => {
          console.error('Error fetching recipes:', error);
          if (error.response) {
            if (error.response.status === 401) {
              setError('API key is invalid or expired. Please check your Spoonacular API key.');
            } else if (error.response.status === 402) {
              setQuotaExceeded(true);
            } else {
              setError(`An error occurred while fetching recipes: ${error.response.status}`);
            }
          } else if (error.request) {
            setError('No response received from the server. Please check your internet connection.');
          } else {
            setError(`An error occurred while fetching recipes: ${error.message}`);
          }
          setRecipes([]);
        })
        .finally(() => setLoading(false));
    }, 1000)
  ).current;

  const fetchRecipes = useCallback((term) => {
    debouncedFetchRecipes(term);
  }, [debouncedFetchRecipes]);

  // This effect will now run less frequently
  useEffect(() => {
    console.log('Effect running with debouncedSearchTerm:', debouncedSearchTerm);
    if (debouncedSearchTerm) {
      fetchRecipes(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchRecipes]);

  console.log('Current state:', { recipes, loading, error, quotaExceeded });

  const handleRecipeClick = async (id) => {
    setLoading(true);
    try {
      const details = await getRecipeDetails(id);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
    setLoading(false);
  };

  const handleImageError = (event) => {
    event.target.style.display = 'none';
  };

  return (
    <div className="App">
      <h1>My Recipe App</h1>
      <input 
        type="text" 
        placeholder="Search recipes..." 
        value={searchTerm}
        onChange={(e) => {
          console.log('Search term changed:', e.target.value);
          setSearchTerm(e.target.value);
        }}
      />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : quotaExceeded ? (
          <p>API quota exceeded. Please try again later.</p>
        ) : recipes && recipes.length > 0 ? (
          <ul>
            {recipes.map(recipe => (
              <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                {recipe.image && (
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    onError={handleImageError}
                  />
                )}
                <h3>{recipe.title}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes found. Try searching for something!</p>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetails 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}

export default App;
