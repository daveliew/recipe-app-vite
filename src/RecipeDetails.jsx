import React from 'react';

function RecipeDetails({ recipe, onClose }) {
  return (
    <div className="recipe-details">
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} />
      <p>Ready in {recipe.readyInMinutes} minutes</p>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <ol>
        {recipe.analyzedInstructions[0]?.steps.map((step) => (
          <li key={step.number}>{step.step}</li>
        ))}
      </ol>
    </div>
  );
}

export default RecipeDetails;
