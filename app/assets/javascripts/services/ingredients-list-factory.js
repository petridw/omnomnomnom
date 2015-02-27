angular
  .module('goodbelly')
  .factory('IngredientsList', [
    "$http",
    function($http) {
      var IngredientsList = function(id) {

        return $http({
          url: '/api/ingredients',
          method: 'GET'
          });

      };

      return (IngredientsList);
    }
  ]);
