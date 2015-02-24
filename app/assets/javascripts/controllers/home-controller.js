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
      console.log(results);
      vm.attribution = results.attribution.html;
    });
  };

  vm.addIngredient = function() {
    if (vm.ingredient !== "") {
      vm.ingredients.push(vm.ingredient);
      vm.ingredient = "";
    }
  };

}