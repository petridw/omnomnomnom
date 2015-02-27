angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http',
    '$state',
    '$stateParams',
    HomeController
  ]);


function HomeController($http, $state, $stateParams) {
  var vm = this;

  vm.keywords = "";
  vm.recipes = [];
  vm.selectedRecipes = [];
  vm.searchResults = false;
  vm.attribution = "";
  vm.loading = false;
  vm.noImageUrl = "http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

  if ($stateParams.ingredients) {
    console.log("setting vm.ingredients: " + $stateParams.ingredients);
    console.log(typeof $stateParams.ingredients);
    vm.ingredients = $stateParams.ingredients.split(',');
    // array param version:
    // vm.ingredients = $stateParams.ingredients;
    console.log(vm.ingredients);
  } else {
    vm.ingredients = [];
  }

  // if there are state params then search
  if ($stateParams.keywords || $stateParams.ingredients) {
    console.log("CALLING HTTP GET ON RECIPES API WITH INGREDIENTS ARRAY:");
    console.log(vm.ingredients);
    vm.keywords = $stateParams.keywords;
    vm.loading = true;
    $http({
      url: '/api/recipes',
      method: 'GET',
      params: {keywords: vm.keywords, 'ingredients[]': vm.ingredients}
      })
      .success(function(data, status, headers, config) {
        console.log(config);
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
  }

  // vm.search = function() {


  // };

  vm.search = function() {
    console.log("going to state home with keywords " + vm.keywords + " and ingredients " + vm.ingredients);
    // var object = {
    //   keywords: vm.keywords,
    //   ingredients: []
    // };
    // for(var index in vm.ingredients){
    //   object.ingredients.push(vm.ingredients[index]);
    // }

    $state.go('home', {keywords: vm.keywords, ingredients: vm.ingredients.join(",")});
    // array params version:
    // $state.go('home', {keywords: vm.keywords, 'ingredients': vm.ingredients, reload: true});
  };

  vm.addIngredient = function() {
    if ((vm.ingredient !== "") && (vm.ingredients.indexOf(vm.ingredient) === -1)){
      vm.ingredients.push(vm.ingredient);
      console.log("ingredients array has", vm.ingredients);
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
    // need to check each string in the ingredient and see if it exists in vm.ingredients
    ingredientWords = ingredient.split(" ");

    for (var i = 0; i < ingredientWords.length; i++) {
      //check if word is in our ingredient list
      for (var ii = 0; ii < vm.ingredients.length; ii ++) {
        //check each word in ingredient
        vmWords = vm.ingredients[ii].split(" ");
        for (var j = 0; j < vmWords.length; j ++) {
          if (ingredientWords[i] === vmWords[j]) {
            console.log(ingredientWords[i] + " equals " + vmWords[j]);
            return true;
          }
        }
      }
    }
    return false;
  };

}