angular
  .module('goodbelly')
  .filter('matchAllIngredients', function() {
    return function(recipe, ingredients) {
      return recipe.filter(function(ingredient) {
        console.log("recipe: ", recipe);
        console.log("ingredients: ", ingredients);
        return true;
      });
 

    };
  });