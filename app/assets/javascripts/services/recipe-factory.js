angular
  .module('goodbelly')
  .factory('Recipe', [
    "$http",
    function($http) {
      var Recipe = function(id) {

        return $http({
          url: '/api/recipe',
          method: 'GET',
          params: {id: id}
          });

      };

      return (Recipe);
    }
  ]);
