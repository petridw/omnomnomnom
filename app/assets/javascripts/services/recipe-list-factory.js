angular
  .module('goodbelly')
  .factory('RecipesList', [
    "$http",
    function($http) {
      var RecipesList = function(keywords, ingredients) {

        return $http({
          url: '/api/recipes',
          method: 'GET',
          params: {keywords: keywords, 'ingredients[]': ingredients}
          });

      };

      return (RecipesList);
    }
  ]);
