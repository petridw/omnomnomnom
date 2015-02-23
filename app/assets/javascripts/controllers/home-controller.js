angular
  .module('goodbelly')
  .controller('HomeController', [
    '$http', 
    '$resource', 
    HomeController
  ]);


function HomeController($http, $resource) {
  var vm = this;

  vm.search = function(keywords) {
    console.log("Searched for " + keywords);
  };

  function yummly() {

  }
}