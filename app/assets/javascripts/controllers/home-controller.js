angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http',
    'RecipeList',
    'Recipe',
    'IngredientMetadata',
    'IngredientList',
    '$state',
    '$stateParams',
    HomeController
  ]);


function HomeController($http, RecipeList, Recipe, IngredientMetadata, IngredientList, $state, $stateParams) {

  var vm = this;

  // Data store:
  vm.keywords           = "";                 // holds keywords that were searched for
  vm.ingredientsData    = [];                 // holds ingredient metadata from yummly
  vm.recipes            = [];                 // holds list of returned recipes from api call
  vm.ingredientList = new IngredientList(""); // holds list of included ingredients

  // State control:
  vm.hoveredIngredient  = -1;     // stores state of which ingredient is being hovered, if any
  vm.searchResults      = false;  // controls whether results area shows
  vm.loading            = false;  // controls whether loading spinner shows

  vm.noImageUrl = "http://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";


  // Get a list of searchable ingredients
  new IngredientMetadata()
    .success(function(data) { vm.ingredientsData = data; })
    .error(function(data) { console.log("Error loading ingredients data"); });

  // Set vm.ingredients and vm.keywords if they exist in params
  if ($stateParams.ingredients) { vm.ingredientList = new IngredientList($stateParams.ingredients); }
  if ($stateParams.keywords) { vm.keywords = $stateParams.keywords; }

  // If there are are keywords or ingredients in the params, then do a recipe search
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
    // - RecipesList constructor accepts a string for keywords and an array for ingredients
    RecipeList.getRecipes(vm.keywords, vm.ingredientList.ingredients)
      .then(
        function(data) {
          vm.loading = false;       // successful result so turn off loading spinner
          vm.recipes = data;        // set recipe list
          vm.searchResults = true;  // show search result section
        },
        function(data) {
          vm.loading = false;       // turn off loading spinner
          console.log("Error loading recipe list. ", data);
        }
      );
  }

  // Function gets called when the "search" button is pressed.
  // It simply goes to the 'home' state with the current keywords and ingredients as params.
  // Once the home state loads up the search will take place, and the keywords / ingredients
  // will be in the URL! This makes search results bookmarkable.
  vm.search = function() {
    $state.go('home', {keywords: vm.keywords, ingredients: vm.ingredientList.to_param()});
  };


  // Function gets called when a recipe is clicked.
  // If the recipe is now selected then it retrieves the expanded recipe data unless
  // it's already been retrieved.
  vm.clickRecipe = function(key) {    
    vm.recipes[key].isSelected = !vm.recipes[key].isSelected;

    if ((vm.recipes[key].isSelected) && (vm.recipes[key].expandedInfo === null)) {

      // Turn on this recipe's loading spinner
      vm.recipes[key].isLoading = true;
    
      new Recipe(vm.recipes[key].id)
        .success(function(data, status, headers, config) {
          vm.recipes[key].isLoading = false;    // turn off loading spinner
          vm.recipes[key].expandedInfo = data;  // give recipe its expanded data
        })
        .error(function(data, status, headers, config) {
          vm.recipes[key].isLoading = false;    // turn off loading spinner
          console.log("Error retrieving recipe data for " + vm.recipes[key] + ".", data);
        });

    }
  };


  // Function gets called when the "add ingredient" button is pressed.
  // If the ingredient isn't in the ingredient list already then it gets added and
  // then a new search is kicked off.
  vm.addIngredient = function() {
    if ((vm.ingredient !== "") && (!vm.ingredientList.hasExactIngredient(vm.ingredient))) {
      vm.ingredientList.addIngredient(vm.ingredient);
      RecipeList.addIngredient();
      vm.search();
    }
  };

  // Simply removes ingredient and initiates a new search
  vm.removeIngredient = function(ingredient) {
    vm.ingredientList.removeIngredient(ingredient);
    RecipeList.removeIngredient();
    vm.search();
  };

  // callback for selecting a field from the typeahead dropdown
  // !!! figure out a way to do this without the callback?
  vm.onSelect = function ($item, $model, $label) {
    vm.ingredient = $item.searchValue;
  };

  vm.ingredientPercentage = function() {
    
  };


}