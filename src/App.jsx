import { useState, useEffect, useCallback } from 'react'
import { searchRecipes, getRecipeDetails } from './api'
import RecipeDetails from './RecipeDetails'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  const debouncedSearch = useCallback(
    (term) => {
      console.log("debouncedSearch called with:", term);
      const search = debounce((term) => {
        console.log("debounced function executing with:", term);
        if (term && term.length >= 3) {
          setLoading(true)
          console.log('Fetching recipes...')
          searchRecipes(term)
            .then(results => {
              console.log('Recipes fetched:', results)
              setRecipes(results)
              setSearchResults(results || [])
              setLoading(false)
            })
            .catch(error => {
              console.error('Error fetching recipes:', error)
              setLoading(false)
            })
        } else {
          console.log('Clearing recipes')
          setRecipes([])
        }
      }, 300);
      if (term) search(term);
    },
    []
  )

  useEffect(() => {
    console.log('Search term changed:', searchTerm)
    debouncedSearch(searchTerm)
    return () => debouncedSearch.cancel()
  }, [searchTerm, debouncedSearch])

  const handleRecipeClick = async (id) => {
    setLoading(true)
    try {
      const details = await getRecipeDetails(id)
      setSelectedRecipe(details)
    } catch (error) {
      console.error('Error fetching recipe details:', error)
    }
    setLoading(false)
  }

  console.log('Rendering. Recipes:', recipes, 'Loading:', loading)

  return (
    <div className="App">
      <h1>My Recipe App</h1>
      <input 
        type="text" 
        placeholder="Search recipes..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found. Try searching for something!</p>
        ) : (
          <ul>
            {recipes.map(recipe => (
              <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedRecipe && (
        <RecipeDetails 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  )
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default App
