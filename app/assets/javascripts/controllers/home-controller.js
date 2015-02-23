angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http', 
    '$resource', 
    HomeController
  ]);


function HomeController($http, $resource) {
  var vm = this;
  var Recipes = $resource('api/recipes/:keywords', {
  });

  vm.searchResults = false;

  vm.search = function(keywords) {
    Recipes.get({keywords: keywords}, function(results) {
      vm.recipes = results;
      vm.searchResults = true;
      console.log(vm.recipes);
    });
  };

  function yummly() {

  }
}