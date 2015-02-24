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

  vm.search = function() {
    Recipes.get({keywords: vm.keywords, ingredients: vm.ingredients}, function(results) {
      vm.recipes = results;
      vm.searchResults = true;
      console.log(vm.recipes);
      vm.attribution = results.attribution.html;
    });
  };

}