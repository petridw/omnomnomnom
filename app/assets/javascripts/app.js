angular
  .module('goodbelly', ['ngResource', 'ui.router', 'templates'])

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

      $stateProvider
        .state('home', {
          url: '',
          templateUrl: 'home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
      });
    }]
  );