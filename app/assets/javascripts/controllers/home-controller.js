angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http',
    'RecipesList',
    'Recipe',
    'IngredientsList',
    '$state',
    '$stateParams',
    HomeController
  ]);


function HomeController($http, RecipesList, Recipe, IngredientsList, $state, $stateParams) {

  var vm = this;


  vm.keywords = "";
  vm.recipes = [];
  vm.selectedRecipes = [];
  vm.searchResults = false;
  vm.attribution = "";
  vm.loading = false;
  vm.ingredientsData = [];
  vm.noImageUrl = "http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

  new IngredientsList()
    .success(function(data) { vm.ingredientsData = data; console.log(data); })
    .error(function(data) { console.log("Error loading ingredients data"); });


  // Set vm.ingredients and vm.keywords if they exist in params
  if ($stateParams.ingredients) {
    vm.ingredients = $stateParams.ingredients.split(',');
    // array param version:
    // vm.ingredients = $stateParams.ingredients;
  } else {
    vm.ingredients = [];
  }

  if ($stateParams.keywords) {
    vm.keywords = $stateParams.keywords;
  } else {
    vm.keywords = "";
  }

  // This way doesn't work but would be less code:
  // vm.ingredients = $stateParams.ingredients.split(',') || [];
  // vm.keywords = $stateParams.keywords || "";


  // get recipes list if there are keyword or ingredient params
  if ($stateParams.keywords || $stateParams.ingredients) {

    // turn on loading spinner
    vm.loading = true;
    
    // !!! if there are already fewer than MAX_RESULT results, then this shouldn't call the api.
    // the Api should only be called when more than MAX_RESULT results are coming back and thus
    // it's more beneficial to hit yummly to get better rated recipes. Once there are under 250,
    // it makes more sense to simply filter down these results as long as it's just a new ingredient
    // that has been added. If an ingredient has been removed or the keywords have changed then
    // a new search must be run.

    // get the list of recipes for the provided keyword / ingredients
    new RecipesList(vm.keywords, vm.ingredients)
      // successful ajax return
      .success(function(data, status, headers, config) {
        vm.loading = false;
        vm.recipes = data;
        vm.searchResults = true;
      })
      // error on ajax call
      .error(function(data, status, headers, config) {
        vm.loading = false;
      });
  }

  

  vm.search = function() {
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
    vm.recipes[key].isSelected = !vm.recipes[key].isSelected;

    if ((vm.recipes[key].isSelected) && (vm.recipes[key].expandedInfo === null)) {
      vm.recipes[key].isLoading = true;
    
      new Recipe(vm.recipes[key].id)
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


  // callback for selecting a field from the typeahead dropdown
  // !!! figure out a way to do this without the callback?
  vm.onSelect = function ($item, $model, $label) {
    vm.ingredient = $item.searchValue;
  };


  // !!! clean this up and stick it somewhere
  // need to figure out how to implement the ingredient metadata
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
            return true;
          }
        }
      }
    }
    return false;
  };

}