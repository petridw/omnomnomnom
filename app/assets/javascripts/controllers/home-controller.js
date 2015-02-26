angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http', 
    HomeController
  ]);


function HomeController($http) {
  var vm = this;

  vm.keywords = "";
  vm.ingredients = [];
  vm.recipes = [];
  vm.selectedRecipes = [];
  vm.searchResults = false;
  vm.attribution = "";
  vm.loading = false;
  vm.noImageUrl = "http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

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
        vm.loading = false;
        console.log(data);
      });

  };

  vm.addIngredient = function() {
    if ((vm.ingredient !== "") && (vm.ingredients.indexOf(vm.ingredient) === -1)){
      vm.ingredients.push(vm.ingredient);
      vm.ingredient = "";
      vm.search();
    }

  };

  vm.clickRecipe = function(key) {
    console.log("hi there, you clicked on recipe " + key);
    
    vm.recipes[key].isSelected = !vm.recipes[key].isSelected;

    // !!! change to only run $http request if this recipe wasn't previously loaded
    if ((vm.recipes[key].isSelected) && (vm.recipes[key].expandedInfo === null)) {
      vm.recipes[key].isLoading = true;
    
      $http({
        url: '/api/recipe',
        method: 'GET',
        params: {id: vm.recipes[key].id}
      })
      .success(function(data, status, headers, config) {
        vm.recipes[key].isLoading = false;
        vm.recipes[key].expandedInfo = data;
      })
      .error(function(data, status, headers, config) {
        vm.recipes[key].isLoading = false;
        console.log(data);
      });

    }
  };

  // !!! implement hasIngredient and then use it instead of indexOf in the home view
  vm.hasIngredient = function(ingredient) {
    // figure out if our ingredients list includes the ingredient.
    // Note: the ingredient in our list may not exactly match this ingredient!
  };

}