angular
  .module('goodbelly')
  .factory('IngredientList', [
    function() {
      var IngredientList = function(ingredient_string) {

        // initialize ingredients array
        // ingredients param is a comma seperated list
        this.initialize = function(ingredient_string) {
          if (ingredient_string.length > 0) {
            this.ingredients = ingredient_string.split(",");
          } else {
            this.ingredients = [];
          }
        };

        // add an ingredient
        this.addIngredient = function (ingredient) {
          this.ingredients.push(ingredient);
          return true;
        };

        // remove an ingredient at given index
        this.removeIngredientAtIndex = function(index) {
          this.ingredients.splice(index, 1);
          return true;
        };

        // remove specific ingredient
        // return true if ingredient successfully removed and false if not found
        this.removeIngredient = function (ingredient) {
          var index = this.ingredients.indexOf(ingredient);

          console.log("removing ingredient " + ingredient + " at index " + index);

          if (index !== -1) {
            this.ingredients.splice(index, 1);
            console.log("new ingredients list: ", this.ingredients);
            return true;
          } else {
            return false;
          }

        };


        // Check whether the ingredient list has an exact match for this ingredient
        // e.g. "butter" and "butter" should match, but "butter" and "unsalted butter"
        // would not match.
        this.hasExactIngredient = function(ingredient) {
          return (this.ingredients.indexOf(ingredient) !== -1);
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
                if (ingredientWords[i] === ourWords[j]) {
                  return true;
                }
              }
            }
          }
          return false;

        };

        // Return a comma-delimited list of the ingredients for passing through angular
        // $stateParams.
        this.to_param = function() {
          return this.ingredients.join(",");
        };

        // this code will run the initialize function every time a new IngredientList is
        // created.
        this.initialize(ingredient_string);

      };

      return (IngredientList);
    }
  ]);
