(function() {
  var app = angular.module('notebook', []);
  // Controller
  app.controller("NotebookController", function($scope, $http, $location) {
    //this.notes = my_notes;
    //$scope.notes = my_notes;
    this.addNote = function() {
      $http.post('http://notes.scrumple.net\:8081/api/note', $scope.note).
      success(function(data) {
        this.error = ''; 
        $location.path('/');
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
    };
    this.getNotes = function() {
      $http({
        method: 'JSONP',
        url: 'http://notes.scrumple.net\:8081/api/notes?callback=JSON_CALLBACK'
      }).
      success(function(data) {
        $scope.notes = data.notes;
        this.error = '';
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
      });
    };
    this.getNotes();
  });

  // Note Widget
  app.directive('noteWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'note-widget.html',
      require: '?ngModel',
      link: function(scope, element, attrs) {
        element.find('pre').on('click', function() {
          element.find('textarea')[0].focus();
        });
      },
      controller: function($scope, $element) {
        $scope.isEditable = 0;
        $scope.setEditable = function() {
          $scope.body = $scope.note.body;
          $scope.isEditable = 1;
        };
        $scope.unsetEditable = function() {
          $scope.note.body = $scope.body;
          $scope.isEditable = 0;
        };
      },
    }
  });
})();
