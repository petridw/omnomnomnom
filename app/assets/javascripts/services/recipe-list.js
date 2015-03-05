angular
  .module('goodbelly')
  .factory('RecipeList', [
    "$http",
    "$q",
    function($http, $q) {

      // interface
      var service = {
        recipes: [],
        keywords: "",
        addedIngredient: false,
        removedIngredient: false,
        getRecipes: getRecipes,
        addIngredient: addIngredient,
        removeIngredient: removeIngredient
      };

      return service;




      // implementation
      function getRecipes(keywords, ingredients, excludedIngredients) {

        // New recipes should be looked up in the following cases:
        //    - 'keywords' has changed
        //    - an ingredient was removed
        //    - an ingredient has been added but cached recipes is 500
        // 
        // The old recipes should be returned/filtered otherwise. This includes:
        //    - an ingredient has been added, which would further limit search results,
        //      and there are already fewer than 500 results so no need to search again.
        //    - all the parameters are the same as before in which the same results can
        //      be displayed again

        var deferred = $q.defer();  // build a promise

        var updateRecipes = false;

        if  ( (service.keywords !== keywords) || 
              (service.addedIngredient && (service.recipes.length >= 75)) || 
              (service.removedIngredient) ||
              (service.recipes.length === 0)
            ) {
          updateRecipes = true;
        }

        // LOGGING
        console.log("Recipe List Service log");
        console.log("Old keyword: " + service.keywords + ". New keyword: " + keywords);
        if (service.addedIngredient) {console.log("Added an ingredient.");}
        if (service.removedIngredient) {console.log("Removed an ingredient.");}
        console.log("# of downloaded recipes already: " + service.recipes.length);
        if (updateRecipes) { console.log("Updating recipes!"); }
        else { console.log("Not updating recipes."); }

        service.keywords = keywords;
        service.addedIngredient = false;
        service.removedIngredient = false;

        if (updateRecipes) {
          recipes = [];

          $http({
            url: '/api/recipes',
            method: 'GET',
            params: { keywords: keywords, 'ingredients[]': ingredients, 'excludedIngredients[]': excludedIngredients }
            })
            .success(function(data) {
              service.recipes = data;
              deferred.resolve(service.recipes);
            })
            .error(function(data) {
              deffered.reject(data);
            });

        } else {
          deferred.resolve(service.recipes);
        }

        return deferred.promise;
      }

      function addIngredient() {
        service.addedIngredient = true;
      }

      function removeIngredient() {
        service.removedIngredient = true;
      }


      
    }
  ]);
