angular
  .module('goodbelly')
  .factory('IngredientList', [
    function() {
      var IngredientList = function(ingredient_string, excluded_ingredient_string) {

        // initialize ingredients array
        // ingredients param is a comma seperated list
        this.initialize = function(ingredient_string, excluded_ingredient_string) {

          if (ingredient_string.length > 0) {
            this.ingredients = ingredient_string.split(",");
          } else {
            this.ingredients = [];
          }
          if (excluded_ingredient_string.length > 0) {
            this.excludedIngredients = excluded_ingredient_string.split(",");
          } else {
            this.excludedIngredients = [];
          }
        };

        // add an ingredient and return true on success
        // if excluded is true then add it to the excludedIngredient list instead
        this.addIngredient = function (ingredient, excluded) {
          if (excluded) {
            this.excludedIngredients.push(ingredient);
          } else {
            this.ingredients.push(ingredient);
          }
          return true;
        };

        // remove an ingredient at given index
        // if excluded is true then remove it from the excludedIngredient list instead
        this.removeIngredientAtIndex = function(index, excluded) {
          if (excluded) {
            this.excludedIngredients.splice(index, 1);
          } else {
            this.ingredients.splice(index, 1);
          }
          return true;
        };

        // remove specific ingredient
        // return true if ingredient successfully removed and false if not found
        // if excluded is true then remove it from the excludedIngredient list instead
        this.removeIngredient = function (ingredient, excluded) {
          var index;

          if (excluded) {

            index = this.excludedIngredients.indexOf(ingredient);
            if (index !== -1) { this.excludedIngredients.splice(index, 1); }
            else { return false; }

          } else {

            index = this.ingredients.indexOf(ingredient);
            if (index !== -1) { this.ingredients.splice(index, 1); } 
            else { return false; }

          }

          return true;

        };


        // Check whether the ingredient list has an exact match for this ingredient
        // e.g. "butter" and "butter" should match, but "butter" and "unsalted butter"
        // would not match.
        this.hasExactIngredient = function(ingredient, excluded) {
          if (excluded) {
            return (this.excludedIngredients.indexOf(ingredient) !== -1);
          } else {
            return (this.ingredients.indexOf(ingredient) !== -1);
          }
        };

        // Check whether or not the ingredient list has a "loose" ingredient match,
        // e.g. "butter" and "unsalted butter" would return true.
        this.hasIngredientMatch = function(ingredient) {
          
          var ingredientWords = ingredient.split(" ");
          var ourWords = [];

          for (var i = 0; i < ingredientWords.length; i++) {
            //check if word is in our ingredient list
            for (var ii = 0; ii < this.ingredients.length; ii ++) {
              //check each word in ingredient
              ourWords = this.ingredients[ii].split(" ");
              for (var j = 0; j < ourWords.length; j ++) {
                if (ingredientWords[i].toLowerCase() === ourWords[j].toLowerCase()) {
                  return true;
                }
              }
            }
          }
          return false;

        };

        // Return a comma-delimited list of the ingredients for passing through angular
        // $stateParams.
        // 
        this.to_param = function(exclude) {
          if (exclude) {
            return this.excludedIngredients.join(",");
          } else {
            return this.ingredients.join(",");
          }
        };

        // this code will run the initialize function every time a new IngredientList is
        // created.
        this.initialize(ingredient_string, excluded_ingredient_string);

      };

      return (IngredientList);
    }
  ]);
