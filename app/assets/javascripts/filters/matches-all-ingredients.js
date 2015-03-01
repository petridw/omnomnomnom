angular
  .module('goodbelly')
  .filter('matchesAllIngredients', function() {
    return function(myIngredients, recipeIngredients) {

      var filtered = [];
      var hasAllIngredients = true;

      // Everything from myIngredients must be in recipe ingredients
      for (var i = 0; i < myIngredients.length; i++) {
        
      }

      return filtered;

    };
  });