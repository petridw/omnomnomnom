angular
  .module('goodbelly', ['ngResource', 
                        'ui.router', 
                        'templates', 
                        'ui.bootstrap', 
                        'infinite-scroll', 
                        'autofocus',
                        'ngAnimate'])

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/?keywords&ingredients&excludedIngredients',
          params: {
            keywords: "",
            ingredients: "",
            excludedIngredients: ""
          },
          templateUrl: 'home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        });
    }]
  );