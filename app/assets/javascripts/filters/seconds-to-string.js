angular
  .module('goodbelly')
  .filter('secondsToString', function() {
    return function(seconds) {

      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds % 3600) / 60);
      var timeString = '';

      if (hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
      if (minutes > 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");

      return timeString;

    };
  });