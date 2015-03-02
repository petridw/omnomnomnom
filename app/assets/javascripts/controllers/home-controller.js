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
  vm.order              = "ingredientPercentage";
  vm.reverse            = true;
  vm.limit              = 20;
  vm.includeIngredient  = "";

  // State control:
  vm.hoveredIngredient  = -1;     // stores state of which ingredient is being hovered, if any
  vm.searchResults      = false;  // controls whether results area shows
  vm.loading            = false;  // controls whether loading spinner shows

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
          vm.loading = false;           // successful result so turn off loading spinner
          vm.recipes = data;            // set recipe list
          updateIngredientPercentage(); // update ingredient percentage for all recipes
          vm.searchResults = true;      // show search result section
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
    // if there is text in the ingredient input and it's a real word then add the ingredient
    // before searching
    $state.go('home', {keywords: vm.keywords, ingredients: vm.ingredientList.to_param()});
  };


  // Function gets called when a recipe is clicked.
  // If the recipe is now selected then it retrieves the expanded recipe data unless
  // it's already been retrieved.
  vm.clickRecipe = function(recipe) {

    recipe.isSelected = !recipe.isSelected;
    console.log("recipe selected status: " + recipe.isSelected);

    if ((recipe.isSelected) && (recipe.expandedInfo === null)) {

      // Turn on this recipe's loading spinner
      recipe.isLoading = true;
    
      new Recipe(recipe.id)
        .success(function(data, status, headers, config) {
          recipe.isLoading = false;    // turn off loading spinner
          recipe.expandedInfo = data;  // give recipe its expanded data
        })
        .error(function(data, status, headers, config) {
          recipe.isLoading = false;    // turn off loading spinner
          console.log("Error retrieving recipe data for " + vm.recipes[key] + ".", data);
        });

    }
  };


  // Function gets called when the "add ingredient" button is pressed.
  // If the ingredient isn't in the ingredient list already then it gets added and
  // then a new search is kicked off.
  vm.addIngredient = function() {
    if ((vm.includeIngredient !== "") && (!vm.ingredientList.hasExactIngredient(vm.includeIngredient))) {
      vm.ingredientList.addIngredient(vm.includeIngredient);
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
    vm.includeIngredient = $item.searchValue;
  };

  // given an array of ingredients, calculate the percentage of them that our ingredients list contains
  updateIngredientPercentage = function() {
    console.log("in ingredientPercentage");

    try {
      for (var i = 0; i < vm.recipes.length; i++) {

        var matches = 0;

        for (var ii = 0; ii < vm.recipes[i].ingredients.length; ii++) {
          if (vm.ingredientList.hasIngredientMatch(vm.recipes[i].ingredients[ii])) {
            matches ++;
          }
        }

        vm.recipes[i].ingredientPercentage = Math.round((matches / vm.recipes[i].ingredients.length)*100);
        // vm.recipes[i].ingredientPercentage = matches;
      }
    } catch(err) {
      console.log(err);
    }

  };

  vm.loadMoreResults = function() {
    if (vm.limit < 500) {
      vm.limit += 20;
    }
  };


  // return true if every single one of our ingredients is represented in this recipe
  // and false otherwise
  vm.matchIngredients = function() {
    return function(recipe) {

      var ingCheck = false;
 
      for (var i = 0; i < vm.ingredientList.ingredients.length; i++) {
        myIngWords = vm.ingredientList.ingredients[i].split(" ");
        ingCheck = false;
        for (var ii = 0; ii < myIngWords.length; ii++) {
          myWord = myIngWords[ii].toLowerCase();

          for (var j = 0; j < recipe.ingredients.length; j++) {
            recIngredient = recipe.ingredients[j].toLowerCase();

            if (recIngredient.search(myWord) !== -1) {
              ingCheck = true;
            }
          }
        }
        if (!ingCheck) {
          // An included ingredient wasn't found in so filter this recipe out
          return false;
        }
      }
      // All included ingredients were found so don't filter this recipe
      return true;
    };

  };







}