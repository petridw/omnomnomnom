angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http', 
    '$resource', 
    HomeController
  ]);


function HomeController($http, $resource) {
  var vm = this;
  var Recipes = $resource('api/recipes', {
  });

  vm.keywords = "";
  vm.ingredients = [];
  vm.searchResults = false;
  vm.attribution = "";
  vm.loading = false;

  vm.search = function() {
    vm.loading = true;
    $http({
      url: '/api/recipes',
      method: 'GET',
      params: {keywords: vm.keywords, "ingredients[]": vm.ingredients}
      })
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        vm.loading = false;
        console.log(data);
        vm.recipes = data;
        vm.searchResults = true;
        console.log("Successful search");
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("There was an error processing the api call.");
      });

  };


  vm.addIngredient = function() {
    if ((vm.ingredient !== "") && (vm.ingredients.indexOf(vm.ingredient) === -1)){
      vm.ingredients.push(vm.ingredient);
      vm.ingredient = "";
      vm.search();
    }

  };

}