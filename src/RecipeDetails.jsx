import React from 'react';

function RecipeDetails({ recipe, onClose }) {
  const handleImageError = (event) => {
    event.target.style.display = 'none';
  };

  return (
    <div className="recipe-details">
      <button onClick={onClose}>Close</button>
      <h2>{recipe.title}</h2>
      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          onError={handleImageError}
        />
      )}
      <p>Ready in {recipe.readyInMinutes} minutes</p>
      <p>Servings: {recipe.servings}</p>
      
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients.map((ingredient, index) => (
          <li key={`${ingredient.id}-${index}`}>{ingredient.original}</li>
        ))}
      </ul>
      
      <h3>Instructions:</h3>
      <ol>
        {recipe.analyzedInstructions[0]?.steps.map((step, index) => (
          <li key={`step-${index}`}>{step.step}</li>
        ))}
      </ol>
      
      {recipe.diets && recipe.diets.length > 0 && (
        <>
          <h3>Diets:</h3>
          <ul>
            {recipe.diets.map((diet, index) => (
              <li key={`diet-${index}`}>{diet}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;
