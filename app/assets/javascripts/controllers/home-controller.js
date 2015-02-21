angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http', 
    '$resource', 
    function($http, $resource){

      var vm = this;
      
      vm.hi = "hehehehe";
    }
  ]);