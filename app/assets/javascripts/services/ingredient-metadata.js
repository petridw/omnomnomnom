angular
  .module('goodbelly')
  .factory('IngredientMetadata', [
    "$http",
    function($http) {
      var IngredientMetadata = function(id) {

        return $http({
          url: '/api/ingredients',
          method: 'GET'
          });

      };

      return (IngredientMetadata);
    }
  ]);
