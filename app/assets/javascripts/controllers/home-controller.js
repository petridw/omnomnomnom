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

  vm.titles = [
    "Get your fridge on.",
    "Fridger it out.",
    "What's in your fridget?",
    "Go fridge yourself.",
    "Fridgin' awesome.",
    "Fridgeddaboudit",
    "What the fridge?"
  ];

  // Data store:
  vm.keywords           = "";                     // holds keywords that were searched for
  vm.ingredientsData    = [];                     // holds ingredient metadata from yummly
  vm.recipes            = [];                     // holds list of returned recipes from api call
  vm.order              = "ingredientPercentage"; // default order for recipe list
  vm.reverse            = true;                   // default direction to order recipe list
  vm.limit              = 12;                     // default limit for num recipes to show
  vm.includeIngredient  = "";
  vm.excludeIngredient  = "";

  vm.ingredientList = new IngredientList("", ""); // holds list of included/excluded ingredients


  // State control:
  vm.hoveredIngredient  = -1;     // stores state of which ingredient is being hovered, if any
  vm.hoveredExcludedIngredient = -1;
  vm.searchResults      = false;  // controls whether results area shows
  vm.loading            = false;  // controls whether loading spinner shows

  // Get a list of searchable ingredients
  new IngredientMetadata()
    .success(function(data) { vm.ingredientsData = data; })
    .error(function(data) { console.log("Error loading ingredients data"); });

  // Set vm.ingredients if they exist in params
  if ($stateParams.ingredients || $stateParams.excludedIngredients) {
    var ingredients = $stateParams.ingredients || "";
    var excludedIngredients = $stateParams.excludedIngredients || "";

    vm.ingredientList = new IngredientList(ingredients, excludedIngredients); 
  }
  // Set vm.keywords if they exist in params
  if ($stateParams.keywords) {
    vm.keywords = $stateParams.keywords;
  }

  // If there are are keywords or ingredients in the params, then do a recipe search
  if ($stateParams.keywords || $stateParams.ingredients || $stateParams.excludedIngredients) {

    // turn on loading spinner
    vm.loading = true;
    
    // !!! if there are already fewer than MAX_RESULT results, then this shouldn't call the api.
    // the Api should only be called when more than MAX_RESULT results are coming back and thus
    // it's more beneficial to hit yummly to get better rated recipes. Once there are under 250,
    // it makes more sense to simply filter down these results as long as it's just a new ingredient
    // that has been added. If an ingredient has been removed or the keywords have changed then
    // a new search must be run.

    // get the list of recipes for the provided keyword / ingredients
    RecipeList.getRecipes(vm.keywords, vm.ingredientList.ingredients, vm.ingredientList.excludedIngredients)
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
    $state.go('home', {keywords: vm.keywords, ingredients: vm.ingredientList.to_param(false), excludedIngredients: vm.ingredientList.to_param(true)});
  };


  // Function gets called when a recipe is clicked.
  // If the recipe is now selected then it retrieves the expanded recipe data unless
  // it's already been retrieved.
  vm.clickRecipe = function(recipe) {

    recipe.isSelected = !recipe.isSelected;
    console.log("what the eff is happening");

    if ((recipe.isSelected) && (recipe.expandedInfo === null)) {

      // Turn on this recipe's loading spinner
      recipe.isLoading = true;
    
      new Recipe(recipe.id)
        .success(function(data, status, headers, config) {
          recipe.isLoading = false;      // turn off loading spinner
          recipe.expandedInfo = data;    // give recipe its expanded data
          resizeCard(recipe.id);
        })
        .error(function(data, status, headers, config) {
          recipe.isLoading = false;    // turn off loading spinner
          console.log("Error retrieving recipe data for " + vm.recipes[key] + ".", data);
        });

    } else {
      // console.log("huh?");
      // resizeCardInfo(recipe.id);
    }

  };


  // Function gets called when the "add ingredient" button is pressed.
  // If the ingredient isn't in the ingredient list already then it gets added and
  // then a new search is kicked off.
  // if exclude is true then add ingredient to excluded list instead
  vm.addIngredient = function(exclude) {
    if (exclude) {
      if ((vm.excludeIngredient !== "") && (!vm.ingredientList.hasExactIngredient(vm.excludeIngredient, true))) {
        vm.ingredientList.addIngredient(vm.excludeIngredient, true);
        RecipeList.addIngredient();
        vm.excludeIngredient = "";
        // vm.search();
      }
    } else {
      if ((vm.includeIngredient !== "") && (!vm.ingredientList.hasExactIngredient(vm.includeIngredient, false))) {
        vm.ingredientList.addIngredient(vm.includeIngredient, false);
        RecipeList.addIngredient();
        vm.includeIngredient = "";
        // vm.search();
      }
    }
  };

  // Simply removes ingredient and initiates a new search
  // if exclude is true then remove from the excluded list instead
  vm.removeIngredient = function(ingredient, exclude) {
    vm.ingredientList.removeIngredient(ingredient, exclude);
    RecipeList.removeIngredient();
    // vm.search();
  };

  // callback for selecting a field from the typeahead dropdown
  vm.onSelectInclude = function ($item, $model, $label) {
    vm.includeIngredient = $item.searchValue;
  };

  // callback for selecting a field from the typeahead dropdown
  vm.onSelectExclude = function ($item, $model, $label) {
    vm.excludeIngredient = $item.searchValue;
  };

  // !!! this should be somewhere else, not in controller
  // given an array of ingredients, calculate the percentage of them that our ingredients list contains
  updateIngredientPercentage = function() {

    try {
      for (var i = 0; i < vm.recipes.length; i++) {

        var matches = 0;

        for (var ii = 0; ii < vm.recipes[i].ingredients.length; ii++) {
          if (vm.ingredientList.hasIngredientMatch(vm.recipes[i].ingredients[ii])) {
            matches ++;
          }
        }

        vm.recipes[i].ingredientMatches = matches;
        vm.recipes[i].ingredientPercentage = Math.round((matches / vm.recipes[i].ingredients.length)*100);
      }
    } catch(err) {
      console.log(err);
    }

  };

  vm.loadMoreResults = function() {
    if (vm.limit < 500) {
      width = $( window ).width();

      // Add 1 row worth of new recipes to the view.
      if (width >= 1200) {
        vm.limit += 6;
      } else if (width >= 992) {
        vm.limit += 4;
      } else if (width >= 768) {
        vm.limit += 3;
      } else {
        vm.limit += 1;
      }

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
          myWord = myIngWords[ii];

          for (var j = 0; j < recipe.ingredients.length; j++) {
            recIngredient = recipe.ingredients[j].toLowerCase();
            recIngWords = recipe.ingredients[j].split(" ");

            for (var jj = 0; jj < recIngWords.length; jj++) {
              if (myWord.toLowerCase() === recIngWords[jj].toLowerCase()) {
                ingCheck = true;
              }
            }

            // if (recIngredient.search(myWord) !== -1) {
            //   ingCheck = true;
            // }
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

  vm.showIcons = function() {
    console.log("window width: " + $( window ).width());
    return ($( window ).width() >= 768);
  };







}