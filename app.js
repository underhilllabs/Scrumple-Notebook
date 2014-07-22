(function() {
  var app = angular.module('notebook', []);
  // Controller
  app.controller("NotebookController", function($scope, $http, $location) {
    $scope.updateNote = function(note) {
      console.log("updating: " + note.id);
      $http.put('http://notes.scrumple.net\:8081/api/note/' + idx, note).
      success(function(data) {
        console.log("note updated some.how..");
        this.error = '';
        $location.path('/');
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
    };
    $scope.addNote = function() {
      var idx = $scope.notes.length+1;
      $scope.notes.push({title: $scope.newnote.title, 
                          body: $scope.newnote.body, 
                          classes: $scope.newnote.classes, 
                          index: idx});
      console.log("note here: " + $scope.newnote.title);
      console.log("note body: " + $scope.newnote);
      $http.post('http://notes.scrumple.net\:8081/api/note', {title: $scope.newnote.title,
                                                              body: $scope.newnote.body, 
                                                              classes: $scope.newnote.classes, 
                                                              index: idx}).
      success(function(data) {
        this.error = '';
        $location.path('/');
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
      $scope.newnote.title='';
      $scope.newnote.body = '';
      $scope.newnote.classes = '';
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
