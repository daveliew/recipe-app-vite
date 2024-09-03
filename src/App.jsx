import { useState, useEffect } from 'react'
import { searchRecipes, getRecipeDetails } from './api'
import RecipeDetails from './RecipeDetails'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    console.log('Search term changed:', searchTerm)
    if (searchTerm.length >= 3) {
      setLoading(true)
      console.log('Fetching recipes...')
      searchRecipes(searchTerm)
        .then(results => {
          console.log('Recipes fetched:', results)
          setRecipes(results)
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
  }, [searchTerm])

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

  useEffect(() => {
    console.log('App component mounted')
  }, [])

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

export default App
